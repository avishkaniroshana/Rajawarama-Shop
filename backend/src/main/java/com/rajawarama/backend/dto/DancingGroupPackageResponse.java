package com.rajawarama.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class DancingGroupPackageResponse {

    private UUID id;
    private String name;
    private String details;
    private Double totalPrice;
    private List<PerformerSummary> includedPerformers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Builder
    public static class PerformerSummary {
        private UUID id;
        private String name;
        private Double pricePerUnit;
        private Integer quantity;
    }
}
