package com.rajawarama.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SpecialPackageRequest {
    @NotBlank(message = "Package Name required!")
    private String name;

    @NotBlank(message = "Description required!")
    private String description;

    private String freeOfChargeItems;

    @NotNull(message = "Price required!")
    private Double price;

    @NotNull(message = "Discount Percentage required!")
    private Double discountPercentage;
}
