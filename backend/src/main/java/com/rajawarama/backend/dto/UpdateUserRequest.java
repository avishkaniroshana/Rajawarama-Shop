package com.rajawarama.backend.dto;

import com.rajawarama.backend.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    @NotBlank(message = "Full name is required!")
    private String fullName;

    @NotBlank(message = "Phone number is required!")
    private String phone;

    private Role role;
}
