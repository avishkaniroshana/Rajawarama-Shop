package com.rajawarama.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
@Getter
@Builder

public class ReportLoginResponse {
    private String userFullName;
    private String userEmail;
    private String role;
    private LocalDateTime loginAt;      // refresh_token.created_at
    private LocalDateTime tokenExpiry;  // refresh_token.expiry_date
}
