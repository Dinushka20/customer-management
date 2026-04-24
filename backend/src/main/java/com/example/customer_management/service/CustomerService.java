package com.example.customer_management.service;

import com.example.customer_management.dto.CustomerRequestDTO;
import com.example.customer_management.dto.CustomerResponseDTO;
import com.example.customer_management.entity.*;
import com.example.customer_management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;

    // ── Create ───────────────────────────────────────────────────────────────
    @Transactional
    public CustomerResponseDTO createCustomer(CustomerRequestDTO dto) {
        if (customerRepository.existsByNicNumber(dto.getNicNumber())) {
            throw new IllegalArgumentException("NIC number already exists: " + dto.getNicNumber());
        }
        Customer customer = toEntity(new Customer(), dto);
        return toDTO(customerRepository.save(customer));
    }

    // ── Update ───────────────────────────────────────────────────────────────
    @Transactional
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO dto) {
        Customer customer = findOrThrow(id);

        // Allow same NIC for the same customer, but reject if another customer has it
        customerRepository.findByNicNumber(dto.getNicNumber())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new IllegalArgumentException("NIC number already used by another customer.");
                    }
                });

        // Clear existing collections — orphanRemoval handles the deletes
        customer.getMobileNumbers().clear();
        customer.getAddresses().clear();
        customer.getFamilyMembers().clear();

        toEntity(customer, dto);
        return toDTO(customerRepository.save(customer));
    }

    // ── Get single ───────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomer(Long id) {
        return toDTO(findOrThrow(id));
    }

    // ── Get all (paginated + searchable) ─────────────────────────────────────
    @Transactional(readOnly = true)
    public Page<CustomerResponseDTO> getAllCustomers(String keyword, Pageable pageable) {
        Page<Customer> page = (keyword == null || keyword.trim().isEmpty())
                ? customerRepository.findAll(pageable)
                : customerRepository.searchByNameOrNic(keyword, pageable);
        return page.map(this::toDTO);
    }

    // ── Delete ───────────────────────────────────────────────────────────────
    @Transactional
    public void deleteCustomer(Long id) {
        customerRepository.delete(findOrThrow(id));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    private Customer findOrThrow(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + id));
    }

    private Customer toEntity(Customer customer, CustomerRequestDTO dto) {
        customer.setName(dto.getName());
        customer.setDateOfBirth(dto.getDateOfBirth());
        customer.setNicNumber(dto.getNicNumber());

        // Mobile numbers
        if (dto.getMobileNumbers() != null) {
            dto.getMobileNumbers().forEach(number -> {
                MobileNumber mobile = new MobileNumber();
                mobile.setCustomer(customer);
                mobile.setNumber(number);
                customer.getMobileNumbers().add(mobile);
            });
        }

        // Addresses
        if (dto.getAddresses() != null) {
            dto.getAddresses().forEach(addrDTO -> {
                City city = cityRepository.findById(addrDTO.getCityId())
                        .orElseThrow(() -> new EntityNotFoundException("City not found: " + addrDTO.getCityId()));
                Country country = countryRepository.findById(addrDTO.getCountryId())
                        .orElseThrow(() -> new EntityNotFoundException("Country not found: " + addrDTO.getCountryId()));

                Address address = new Address();
                address.setCustomer(customer);
                address.setAddressLine1(addrDTO.getAddressLine1());
                address.setAddressLine2(addrDTO.getAddressLine2());
                address.setCity(city);
                address.setCountry(country);
                customer.getAddresses().add(address);
            });
        }

        // Family members
        if (dto.getFamilyMemberIds() != null) {
            dto.getFamilyMemberIds().forEach(memberId -> {
                Customer member = customerRepository.findById(memberId)
                        .orElseThrow(() -> new EntityNotFoundException("Family member customer not found: " + memberId));
                customer.getFamilyMembers().add(member);
            });
        }

        return customer;
    }

    public CustomerResponseDTO toDTO(Customer c) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setDateOfBirth(c.getDateOfBirth());
        dto.setNicNumber(c.getNicNumber());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());

        dto.setMobileNumbers(
                c.getMobileNumbers().stream()
                        .map(MobileNumber::getNumber)
                        .collect(Collectors.toList())
        );

        dto.setAddresses(
                c.getAddresses().stream().map(a -> {
                    CustomerResponseDTO.AddressDTO adto = new CustomerResponseDTO.AddressDTO();
                    adto.setId(a.getId());
                    adto.setAddressLine1(a.getAddressLine1());
                    adto.setAddressLine2(a.getAddressLine2());
                    adto.setCityName(a.getCity().getName());
                    adto.setCountryName(a.getCountry().getName());
                    return adto;
                }).collect(Collectors.toList())
        );

        dto.setFamilyMembers(
                c.getFamilyMembers().stream().map(fm -> {
                    CustomerResponseDTO.FamilyMemberDTO fmdto = new CustomerResponseDTO.FamilyMemberDTO();
                    fmdto.setId(fm.getId());
                    fmdto.setName(fm.getName());
                    fmdto.setNicNumber(fm.getNicNumber());
                    return fmdto;
                }).collect(Collectors.toList())
        );

        return dto;
    }
}