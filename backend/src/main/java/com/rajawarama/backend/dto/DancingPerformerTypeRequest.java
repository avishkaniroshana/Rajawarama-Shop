package com.rajawarama.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;

@Getter
public class DancingPerformerTypeRequest {
    @NotBlank(message = "Name is required!")
    private String name;

    @NotNull @Positive(message = "Price must be > 0!")
    private Double pricePerUnit;

    @NotNull @PositiveOrZero(message = "Max availability cannot be negative!")
    private Integer maxAvailable;

}
