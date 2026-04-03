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

@Getter @Setter
public class CreateDressOnlyBookingRequest {

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

    @NotEmpty(message = "At least one dress selection is required!")
    @Valid
    private List<DressSelectionEntry> dressSelections = new ArrayList<>();

    @Getter @Setter
    public static class DressSelectionEntry {

        @NotNull(message = "Dress item is required!")
        private UUID dressItemId;

        @NotNull(message = "Role is required!")
        private DressRole role;

        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity = 1;
    }
}
