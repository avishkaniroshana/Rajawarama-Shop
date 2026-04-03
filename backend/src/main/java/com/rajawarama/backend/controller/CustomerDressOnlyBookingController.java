package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.booking.CreateDressOnlyBookingRequest;
import com.rajawarama.backend.dto.booking.DressOnlyBookingResponse;
import com.rajawarama.backend.service.DressOnlyBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings/dress-only")
@RequiredArgsConstructor
public class CustomerDressOnlyBookingController {

    private final DressOnlyBookingService service;

    private String email(Authentication auth) { return auth.getName(); }

    // POST → /api/bookings/dress-only
    @PostMapping
    public ResponseEntity<DressOnlyBookingResponse> create(
            Authentication auth,
            @Valid @RequestBody CreateDressOnlyBookingRequest request
    ) {
        return ResponseEntity.ok(service.createBooking(email(auth), request));
    }

    // GET → /api/bookings/dress-only
    @GetMapping
    public ResponseEntity<List<DressOnlyBookingResponse>> getMyBookings(Authentication auth) {
        return ResponseEntity.ok(service.getMyBookings(email(auth)));
    }

    // GET → /api/bookings/dress-only/{requestId}
    @GetMapping("/{requestId}")
    public ResponseEntity<DressOnlyBookingResponse> getOne(
            Authentication auth,
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(service.getMyBookingById(email(auth), requestId));
    }

    // PUT → /api/bookings/dress-only/{requestId}/cancel
    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<DressOnlyBookingResponse> cancel(
            Authentication auth,
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(service.cancelBooking(email(auth), requestId));
    }

    // PUT → /api/bookings/dress-only/{requestId}/accept-price
    @PutMapping("/{requestId}/accept-price")
    public ResponseEntity<DressOnlyBookingResponse> acceptPrice(
            Authentication auth,
            @PathVariable UUID requestId
    ) {
        return ResponseEntity.ok(service.acceptPrice(email(auth), requestId));
    }
}