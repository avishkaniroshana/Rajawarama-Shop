package com.rajawarama.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// DancingGroupPackageRequest.java
@Getter
@Setter
public class DancingGroupPackageRequest {

    @NotBlank(message = "Package name is required")
    private String name;

    private String details;

    @Valid
    private List<PerformerItem> performers = new ArrayList<>();

    @Getter
    @Setter
    public static class PerformerItem {
        @NotNull(message = "Performer type ID is required")
        private UUID performerTypeId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
