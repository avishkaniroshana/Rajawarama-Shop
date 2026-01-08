package com.rajawarama.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ProfileResponse {

    private String email;
    private String fullName;
    private String phone;
    private String role;
    private LocalDateTime createdAt;

}
