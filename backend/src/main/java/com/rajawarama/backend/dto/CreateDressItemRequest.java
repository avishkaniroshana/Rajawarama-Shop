package com.rajawarama.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CreateDressItemRequest {

    @NotBlank(message = "Dress name is required!")
    private String dressItemName;

    private String description;

    @PositiveOrZero(message = "Adult quantity cannot be negative!")
    private Integer quantityAdult;

    @PositiveOrZero(message = "Page boys quantity cannot be negative!")
    private Integer quantityPageBoys;

    @NotNull(message = "Category ID is required!")
    private UUID categoryId;
}
