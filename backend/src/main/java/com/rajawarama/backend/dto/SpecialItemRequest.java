package com.rajawarama.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpecialItemRequest {

    @NotBlank(message = "Item type is required")
    private String itemType;

    private String name;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    @PositiveOrZero(message = "Price per unit cannot be negative")
    private Double pricePerUnit = 0.0;
}