// PATH: src/main/java/com/rajawarama/backend/dto/booking/SpecialPackageBookingResponse.java

package com.rajawarama.backend.dto.booking;

import com.rajawarama.backend.enums.DressRole;
import com.rajawarama.backend.enums.RequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class SpecialPackageBookingResponse {

    private UUID requestId;

    // User info
    private UUID userId;
    private String userFullName;
    private String userEmail;
    private String userPhone;

    // Special package info
    private UUID specialPackageId;
    private String specialPackageName;
    private Double specialPackageFinalPrice;   // base package price (always the original)

    // ----------- STORED PRICES (from DB columns)
    // bookingSubtotal = specialPkg.finalPrice + dancingAdj + extraPerformers
    // Calculated once at creation and stored — never recalculated on read.
    private Double bookingSubtotal;

    // grandTotal = bookingSubtotal + transportPrice
    // Stored when admin sets transport price. Null until then.
    private Double grandTotal;

    // Event details
    private String hotelName;
    private String nearestCity;
    private LocalDate eventDate;
    private String contactNo;
    private LocalTime groomArrivalTime;
    private LocalTime poruwaStartTime;
    private String specialNotes;

    // Dress selections
    private List<DressSelectionResponse> dressSelections;

    // Dancing package
    private DancingPackageSummary selectedDancingPackage;

    // Extra performers
    private List<ExtraPerformerResponse> extraPerformers;

    // Status & pricing
    private RequestStatus status;
    private Double transportPrice;
    private boolean finalPriceAccepted;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // -------------------------------- Nested response classes

    @Getter
    @Builder
    public static class DressSelectionResponse {
        private UUID id;
        private DressRole role;
        private UUID dressItemId;
        private String dressItemName;
        private String categoryName;
        private String imagePath;
    }

    @Getter
    @Builder
    public static class DancingPackageSummary {
        private UUID id;
        private String name;
        private Double totalPrice;
        private String description;
    }

    @Getter
    @Builder
    public static class ExtraPerformerResponse {
        private UUID id;
        private UUID performerTypeId;
        private String performerTypeName;
        private Double pricePerUnit;
        private Integer quantity;
    }
}


