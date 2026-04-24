package com.example.customer_management.repository;

import com.example.customer_management.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByNicNumber(String nicNumber);

    boolean existsByNicNumber(String nicNumber);

    // Search by name or NIC - used for the list/table view
    @Query("SELECT c FROM Customer c WHERE " +
            "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.nicNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Customer> searchByNameOrNic(@Param("keyword") String keyword, Pageable pageable);
}