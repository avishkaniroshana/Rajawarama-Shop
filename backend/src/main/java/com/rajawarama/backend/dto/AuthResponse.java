package com.rajawarama.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UUID userId;
    private String email;
    private String role;
    private String fullName;
}
