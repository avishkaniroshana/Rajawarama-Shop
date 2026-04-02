package com.rajawarama.backend.dto.booking;

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
public class DancingPackageBookingResponse {

    private UUID requestId;

    // User info
    private UUID userId;
    private String userFullName;
    private String userEmail;
    private String userPhone;

    // Dancing package info
    private UUID dancingPackageId;
    private String dancingPackageName;
    private Double dancingPackageBasePrice;  // stored totalPrice of the package at booking time

    // ------------------STORED PRICES (from DB columns)
    // bookingSubtotal = dancingPackage.totalPrice + extraPerformers total
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

    // Extra performers
    private List<ExtraPerformerResponse> extraPerformers;

    // Status & pricing
    private RequestStatus status;
    private Double transportPrice;
    private boolean finalPriceAccepted;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // -------------------------------- Nested

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


