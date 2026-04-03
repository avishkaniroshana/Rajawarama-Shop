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

@Getter @Builder
public class DressOnlyBookingResponse {

    private UUID requestId;
    private UUID userId;
    private String userFullName;
    private String userEmail;
    private String userPhone;

    private String hotelName;
    private String nearestCity;
    private LocalDate eventDate;
    private String contactNo;
    private LocalTime groomArrivalTime;
    private LocalTime poruwaStartTime;
    private String specialNotes;

    private RequestStatus status;
    private Double transportPrice;
    private Double bookingSubtotal;
    private Double grandTotal;
    private boolean finalPriceAccepted;

    private List<DressSelectionResponse> dressSelections;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter @Builder
    public static class DressSelectionResponse {
        private UUID selectionId;
        private UUID dressItemId;
        private String dressItemName;
        private String categoryName;
        private Double categoryGroomDressPrice;
        private Double categoryBestmanDressPrice;
        private Double categoryPageBoyDressPrice;
        private DressRole role;
        private Integer quantity;
        private Double unitPrice;     // actual price used for this role
        private Double lineTotal;     // unitPrice × quantity
        private String imageUrl;
    }
}
