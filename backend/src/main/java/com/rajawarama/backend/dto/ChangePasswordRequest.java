package com.rajawarama.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class ChangePasswordRequest {
    @NotBlank
    private String currentPassword;

    @Size(min = 8)
    private String newPassword;

    @NotBlank
    private String confirmPassword;
}
