package com.rajawarama.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SignUpRequest {

    @Email(message = "Invalid email address!")
    @NotBlank(message = "Email is required!")
    private String email;

    @NotBlank(message = "Full name is required!")
    private String fullName;

    @NotBlank(message = "Password is required!")
    @Size(min = 8, message = "Password must be at least 8!")
    private String password;

    @NotBlank(message = "Phone number is required!")
    private String phone;
}
