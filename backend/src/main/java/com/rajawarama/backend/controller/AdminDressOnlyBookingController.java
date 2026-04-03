package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.booking.DressOnlyBookingResponse;
import com.rajawarama.backend.dto.booking.SetTransportPriceRequest;
import com.rajawarama.backend.service.DressOnlyBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/booking-requests/dress-only")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminDressOnlyBookingController {

    private final DressOnlyBookingService service;

    // GET → /api/admin/booking-requests/dress-only
    @GetMapping
    public ResponseEntity<List<DressOnlyBookingResponse>> getAll() {
        return ResponseEntity.ok(service.getAllBookings());
    }

    // GET → /api/admin/booking-requests/dress-only/{requestId}
    @GetMapping("/{requestId}")
    public ResponseEntity<DressOnlyBookingResponse> getOne(@PathVariable UUID requestId) {
        return ResponseEntity.ok(service.getBookingById(requestId));
    }

    // PUT → /api/admin/booking-requests/dress-only/{requestId}/set-price
    @PutMapping("/{requestId}/set-price")
    public ResponseEntity<DressOnlyBookingResponse> setPrice(
            @PathVariable UUID requestId,
            @Valid @RequestBody SetTransportPriceRequest req
    ) {
        return ResponseEntity.ok(service.setTransportPrice(requestId, req.getTransportPrice()));
    }

    // PUT → /api/admin/booking-requests/dress-only/{requestId}/approve
    @PutMapping("/{requestId}/approve")
    public ResponseEntity<DressOnlyBookingResponse> approve(@PathVariable UUID requestId) {
        return ResponseEntity.ok(service.approveBooking(requestId));
    }

    // PUT → /api/admin/booking-requests/dress-only/{requestId}/reject
    @PutMapping("/{requestId}/reject")
    public ResponseEntity<DressOnlyBookingResponse> reject(@PathVariable UUID requestId) {
        return ResponseEntity.ok(service.rejectBooking(requestId));
    }

    // PUT → /api/admin/booking-requests/dress-only/{requestId}/complete
    @PutMapping("/{requestId}/complete")
    public ResponseEntity<DressOnlyBookingResponse> complete(@PathVariable UUID requestId) {
        return ResponseEntity.ok(service.completeBooking(requestId));
    }
}