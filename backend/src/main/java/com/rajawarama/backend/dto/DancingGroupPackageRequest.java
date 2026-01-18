package com.rajawarama.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class DancingGroupPackageRequest {


    @NotBlank(message = "Package name is required!")
    private String name;

    @NotBlank(message = "Details are required!")
    private String details;

    @NotNull(message = "Price is required!")
    private Double price;

}
