package com.rajawarama.backend.dto.booking;

import com.rajawarama.backend.enums.DressRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CreateSpecialPackageBookingRequest {

    @NotNull(message = "Special package is required!")
    private UUID specialPackageId;

    @NotBlank(message = "Hotel name is required!")
    private String hotelName;

    @NotBlank(message = "Nearest city is required!")
    private String nearestCity;

    @NotNull(message = "Event date is required!")
    @Future(message = "Event date must be in the future!")
    private LocalDate eventDate;

    @NotBlank(message = "Contact number is required!")
    private String contactNo;

    private LocalTime groomArrivalTime;

    private LocalTime poruwaStartTime;

    private String specialNotes;

    // Dress selections — at least 1 (for groom)
    @NotEmpty(message = "At least one dress selection is required!")
    @Valid
    private List<DressSelectionEntry> dressSelections = new ArrayList<>();

    // Optional for override the dancing package linked to the special package
    private UUID overrideDancingPackageId;

    // Optional for extra performers on top of the dancing package
    @Valid
    private List<ExtraPerformerEntry> extraPerformers = new ArrayList<>();

    //  --------------------------------------------- Nested DTOs

    @Getter
    @Setter
    public static class DressSelectionEntry {

        @NotNull(message = "Dress role is required!")
        private DressRole role;   // GROOM | BEST_MAN | PAGE_BOY

        @NotNull(message = "Dress item is required!")
        private UUID dressItemId;
    }

    @Getter
    @Setter
    public static class ExtraPerformerEntry {

        @NotNull(message = "Performer type is required!")
        private UUID performerTypeId;

        @NotNull(message = "Quantity is required!")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
 