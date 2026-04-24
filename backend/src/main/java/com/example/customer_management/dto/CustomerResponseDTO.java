package com.example.customer_management.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CustomerResponseDTO {

    private Long id;
    private String name;
    private LocalDate dateOfBirth;
    private String nicNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<String> mobileNumbers;
    private List<AddressDTO> addresses;
    private List<FamilyMemberDTO> familyMembers;

    @Data
    public static class AddressDTO {
        private Long id;
        private String addressLine1;
        private String addressLine2;
        private String cityName;
        private String countryName;
    }

    @Data
    public static class FamilyMemberDTO {
        private Long id;
        private String name;
        private String nicNumber;
    }
}
