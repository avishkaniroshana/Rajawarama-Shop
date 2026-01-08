package com.rajawarama.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required!")
    private String fullName;

    @NotBlank(message = "Phone number is required!")
    private String phone;
}