package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.booking.SetTransportPriceRequest;
import com.rajawarama.backend.dto.booking.SpecialPackageBookingResponse;
import com.rajawarama.backend.service.SpecialPackageBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/booking-requests/special-packages")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    private final SpecialPackageBookingService bookingService;

    // GET all → http://localhost:8080/api/admin/booking-requests/special-packages
    @GetMapping
    public ResponseEntity<List<SpecialPackageBookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET one → http://localhost:8080/api/admin/booking-requests/special-packages/{requestId}
    @GetMapping("/{requestId}")
    public ResponseEntity<SpecialPackageBookingResponse> getById(
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(bookingService.getBookingById(requestId));
    }


    // PUT set price → http://localhost:8080/api/admin/booking-requests/special-packages/{requestId}/set-price
    @PutMapping("/{requestId}/set-price")
    public ResponseEntity<SpecialPackageBookingResponse> setTransportPrice(
            @PathVariable UUID requestId,
            @Valid @RequestBody SetTransportPriceRequest request
    ) {
        return ResponseEntity.ok(bookingService.setTransportPrice(requestId, request));
    }


    // PUT approve → http://localhost:8080/api/admin/booking-requests/special-packages/{requestId}/approve
    @PutMapping("/{requestId}/approve")
    public ResponseEntity<SpecialPackageBookingResponse> approve(
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(bookingService.approveBooking(requestId));
    }


    // PUT reject → http://localhost:8080/api/admin/booking-requests/special-packages/{requestId}/reject
    @PutMapping("/{requestId}/reject")
    public ResponseEntity<SpecialPackageBookingResponse> reject(
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(bookingService.rejectBooking(requestId));
    }


    // PUT complete → http://localhost:8080/api/admin/booking-requests/special-packages/{requestId}/complete
    @PutMapping("/{requestId}/complete")
    public ResponseEntity<SpecialPackageBookingResponse> complete(
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(bookingService.completeBooking(requestId));
    }
}
