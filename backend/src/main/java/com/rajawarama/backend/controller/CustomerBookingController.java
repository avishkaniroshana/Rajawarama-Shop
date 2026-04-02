package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.booking.CreateSpecialPackageBookingRequest;
import com.rajawarama.backend.dto.booking.SpecialPackageBookingResponse;
import com.rajawarama.backend.service.SpecialPackageBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings/special-packages")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerBookingController {

    private final SpecialPackageBookingService bookingService;

    private String getEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    // POST → http://localhost:8080/api/bookings/special-packages
    @PostMapping
    public ResponseEntity<SpecialPackageBookingResponse> createBooking(
            @Valid @RequestBody CreateSpecialPackageBookingRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bookingService.createBooking(getEmail(), request));
    }

    // GET → http://localhost:8080/api/bookings/special-packages
    @GetMapping
    public ResponseEntity<List<SpecialPackageBookingResponse>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings(getEmail()));
    }

    // GET → http://localhost:8080/api/bookings/special-packages/{requestId}
    @GetMapping("/{requestId}")
    public ResponseEntity<SpecialPackageBookingResponse> getMyBookingById(
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(bookingService.getMyBookingById(getEmail(), requestId));
    }

    // PUT → http://localhost:8080/api/bookings/special-packages/{requestId}/cancel
    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<SpecialPackageBookingResponse> cancelBooking(
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(bookingService.cancelBooking(getEmail(), requestId));
    }

    // PUT → http://localhost:8080/api/bookings/special-packages/{requestId}/accept-price
    @PutMapping("/{requestId}/accept-price")
    public ResponseEntity<SpecialPackageBookingResponse> acceptPrice(
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(bookingService.acceptPrice(getEmail(), requestId));
    }

}