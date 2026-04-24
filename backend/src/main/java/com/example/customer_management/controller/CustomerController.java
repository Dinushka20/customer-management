package com.example.customer_management.controller;

import com.example.customer_management.dto.CustomerRequestDTO;
import com.example.customer_management.dto.CustomerResponseDTO;
import com.example.customer_management.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // POST /api/customers  → create
    @PostMapping
    public ResponseEntity<CustomerResponseDTO> create(@Valid @RequestBody CustomerRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerService.createCustomer(dto));
    }

    // PUT /api/customers/{id}  → update
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequestDTO dto) {
        return ResponseEntity.ok(customerService.updateCustomer(id, dto));
    }

    // GET /api/customers/{id}  → view single customer
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomer(id));
    }

    // GET /api/customers?page=0&size=10&search=dinushka  → table view
    @GetMapping
    public ResponseEntity<Page<CustomerResponseDTO>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(customerService.getAllCustomers(search, pageable));
    }

    // DELETE /api/customers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}