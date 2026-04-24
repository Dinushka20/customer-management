package com.example.customer_management.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

// ── Request DTO (used for create & update) ──────────────────────────────────
@Data
public class CustomerRequestDTO {

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotNull(message = "Date of birth is mandatory")
    private LocalDate dateOfBirth;

    @NotBlank(message = "NIC number is mandatory")
    private String nicNumber;

    private List<String> mobileNumbers = new ArrayList<>();

    private List<AddressDTO> addresses = new ArrayList<>();

    private List<Long> familyMemberIds = new ArrayList<>();

    // ── Nested Address DTO ───────────────────────────────────────────────────
    @Data
    public static class AddressDTO {
        @NotBlank(message = "Address line 1 is mandatory")
        private String addressLine1;
        private String addressLine2;

        @NotNull(message = "City is mandatory")
        private Long cityId;

        @NotNull(message = "Country is mandatory")
        private Long countryId;
    }
}
