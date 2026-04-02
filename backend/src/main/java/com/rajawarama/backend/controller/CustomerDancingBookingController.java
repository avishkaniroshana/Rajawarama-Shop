package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.booking.CreateDancingPackageBookingRequest;
import com.rajawarama.backend.dto.booking.DancingPackageBookingResponse;
import com.rajawarama.backend.service.DancingPackageBookingService;
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
@RequestMapping("/api/bookings/dancing-packages")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerDancingBookingController {

    private final DancingPackageBookingService bookingService;

    private String getEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    // POST → http://localhost:8080/api/bookings/dancing-packages
    @PostMapping
    public ResponseEntity<DancingPackageBookingResponse> createBooking(
            @Valid @RequestBody CreateDancingPackageBookingRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bookingService.createBooking(getEmail(), request));
    }

    // GET → http://localhost:8080/api/bookings/dancing-packages
    @GetMapping
    public ResponseEntity<List<DancingPackageBookingResponse>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings(getEmail()));
    }

    // GET → http://localhost:8080/api/bookings/dancing-packages/{requestId}
    @GetMapping("/{requestId}")
    public ResponseEntity<DancingPackageBookingResponse> getMyBookingById(
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(bookingService.getMyBookingById(getEmail(), requestId));
    }

    // PUT → http://localhost:8080/api/bookings/dancing-packages/{requestId}/cancel
    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<DancingPackageBookingResponse> cancelBooking(
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(bookingService.cancelBooking(getEmail(), requestId));
    }

    // PUT → http://localhost:8080/api/bookings/dancing-packages/{requestId}/accept-price
    @PutMapping("/{requestId}/accept-price")
    public ResponseEntity<DancingPackageBookingResponse> acceptPrice(
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(bookingService.acceptPrice(getEmail(), requestId));
    }
}