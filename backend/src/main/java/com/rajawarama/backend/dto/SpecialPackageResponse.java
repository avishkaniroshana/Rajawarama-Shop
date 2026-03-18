package com.rajawarama.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class SpecialPackageResponse {

    private UUID id;
    private String name;
    private String description; // auto-generated
    private Double discountPercent;
    private Double finalPrice; // calculated
    private boolean weddingCoordinationIncluded;
    private boolean weddingPackagingIncluded;
    private UUID linkedDancingPackageId;
    private String linkedDancingPackageName;
    private List<SpecialItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> freeItems;

    @Getter
    @Builder
    public static class SpecialItemResponse {
        private UUID id;
        private UUID specialItemTypeId;
        private String specialItemTypeName;
        private Integer quantity;
        private Double pricePerUnit;
    }
}

