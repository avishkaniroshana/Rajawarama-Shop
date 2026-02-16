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

    // This will contain full URL like below url
    // http://localhost:8080/api/images/abc123.png
    private String imagePath;

    private Integer quantityAdult;

    private Integer quantityPageBoys;

    private UUID categoryId;

    private String categoryName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}