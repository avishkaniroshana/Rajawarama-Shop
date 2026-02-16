package com.rajawarama.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CreateDressItemRequest {

    @NotBlank(message = "Dress name is required")
    private String dressItemName;

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

}
