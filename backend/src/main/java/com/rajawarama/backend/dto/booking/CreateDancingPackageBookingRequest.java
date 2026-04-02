package com.rajawarama.backend.dto.booking;

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
public class CreateDancingPackageBookingRequest {

    @NotNull(message = "Dancing package is required!")
    private UUID dancingPackageId;

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

    // Optional for extra performers on top of the dancing package
    @Valid
    private List<ExtraPerformerEntry> extraPerformers = new ArrayList<>();

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