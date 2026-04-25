package com.example.customer_management;

import com.example.customer_management.dto.CustomerRequestDTO;
import com.example.customer_management.dto.CustomerResponseDTO;
import com.example.customer_management.service.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class CustomerServiceTest {

    @Autowired
    private CustomerService customerService;

    @Test
    void testCreateAndFetchCustomer() {
        // Prepare Request
        CustomerRequestDTO request = new CustomerRequestDTO();
        request.setName("JUnit Test User");
        request.setNicNumber("950000000V");
        request.setDateOfBirth(LocalDate.of(1995, 5, 15));
        request.setMobileNumbers(Collections.singletonList("+94770000000"));
        
        // Add an address (using IDs from seed data, assuming 1 is Sri Lanka/Colombo)
        CustomerRequestDTO.AddressDTO address = new CustomerRequestDTO.AddressDTO();
        address.setAddressLine1("123 Test St");
        address.setCountryId(1L);
        address.setCityId(1L);
        request.setAddresses(Collections.singletonList(address));
        request.setFamilyMemberIds(new ArrayList<>());

        // Create
        CustomerResponseDTO created = customerService.createCustomer(request);
        assertNotNull(created.getId());
        assertEquals("JUnit Test User", created.getName());

        // Fetch
        CustomerResponseDTO fetched = customerService.getCustomer(created.getId());
        assertEquals("950000000V", fetched.getNicNumber());
        assertEquals(1, fetched.getMobileNumbers().size());
        assertEquals(1, fetched.getAddresses().size());
    }

    @Test
    void testDuplicateNicFailure() {
        CustomerRequestDTO request1 = new CustomerRequestDTO();
        request1.setName("User 1");
        request1.setNicNumber("801234567V"); 
        request1.setDateOfBirth(LocalDate.of(1990, 1, 1));
        request1.setMobileNumbers(new ArrayList<>());
        request1.setAddresses(new ArrayList<>());
        request1.setFamilyMemberIds(new ArrayList<>());

        customerService.createCustomer(request1);

        CustomerRequestDTO request2 = new CustomerRequestDTO();
        request2.setName("User 2");
        request2.setNicNumber("801234567V"); // Same NIC
        request2.setDateOfBirth(LocalDate.of(1992, 2, 2));
        request2.setMobileNumbers(new ArrayList<>());
        request2.setAddresses(new ArrayList<>());
        request2.setFamilyMemberIds(new ArrayList<>());

        // Should throw IllegalArgumentException according to CustomerService.java:29
        assertThrows(IllegalArgumentException.class, () -> customerService.createCustomer(request2));
    }
}
