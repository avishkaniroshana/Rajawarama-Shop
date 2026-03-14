package com.rajawarama.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class DancingPerformerTypeResponse {
    private UUID id;
    private String name;
    private Double pricePerUnit;
    private Integer maxAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}