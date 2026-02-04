package com.rajawarama.backend.dto;

import com.rajawarama.backend.enums.Role;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class UserResponse {
    private UUID userId;
    private String email;
    private String fullName;
    private String phone;
    private Role role;
    private boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}
