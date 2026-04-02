package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.booking.DancingPackageBookingResponse;
import com.rajawarama.backend.dto.booking.SetTransportPriceRequest;
import com.rajawarama.backend.service.DancingPackageBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/booking-requests/dancing-packages")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDancingBookingController {

    private final DancingPackageBookingService bookingService;

    // GET all → http://localhost:8080/api/admin/booking-requests/dancing-packages
    @GetMapping
    public ResponseEntity<List<DancingPackageBookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET one → http://localhost:8080/api/admin/booking-requests/dancing-packages/{requestId}
    @GetMapping("/{requestId}")
    public ResponseEntity<DancingPackageBookingResponse> getById(@PathVariable UUID requestId) {
        return ResponseEntity.ok(bookingService.getBookingById(requestId));
    }

    // PUT set price → http://localhost:8080/api/admin/booking-requests/dancing-packages/{requestId}/set-price
    @PutMapping("/{requestId}/set-price")
    public ResponseEntity<DancingPackageBookingResponse> setTransportPrice(
            @PathVariable UUID requestId,
            @Valid @RequestBody SetTransportPriceRequest request
    ) {
        return ResponseEntity.ok(bookingService.setTransportPrice(requestId, request));
    }

    // PUT approve → http://localhost:8080/api/admin/booking-requests/dancing-packages/{requestId}/approve
    @PutMapping("/{requestId}/approve")
    public ResponseEntity<DancingPackageBookingResponse> approve(@PathVariable UUID requestId) {
        return ResponseEntity.ok(bookingService.approveBooking(requestId));
    }

    // PUT reject → http://localhost:8080/api/admin/booking-requests/dancing-packages/{requestId}/reject
    @PutMapping("/{requestId}/reject")
    public ResponseEntity<DancingPackageBookingResponse> reject(@PathVariable UUID requestId) {
        return ResponseEntity.ok(bookingService.rejectBooking(requestId));
    }

    // PUT complete → http://localhost:8080/api/admin/booking-requests/dancing-packages/{requestId}/complete
    @PutMapping("/{requestId}/complete")
    public ResponseEntity<DancingPackageBookingResponse> complete(@PathVariable UUID requestId) {
        return ResponseEntity.ok(bookingService.completeBooking(requestId));
    }
}