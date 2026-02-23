package com.rajawarama.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class DressItemResponse {

    private UUID dressItemId;

    private String dressItemName;

    private String description;

    private Integer quantityAdult;

    private Integer quantityPageBoys;

    private String imagePath;

    private UUID categoryId;

    private String categoryName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
