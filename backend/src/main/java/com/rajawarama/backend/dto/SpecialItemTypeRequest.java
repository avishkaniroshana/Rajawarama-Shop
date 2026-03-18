package com.rajawarama.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpecialItemTypeRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Price per unit is required")
    @Positive(message = "Price must be positive")
    private Double pricePerUnit;

    @PositiveOrZero(message = "Max available cannot be negative")
    private Integer maxAvailable = 999;
}
