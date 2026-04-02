package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.booking.CreateDancingPackageBookingRequest;
import com.rajawarama.backend.dto.booking.DancingPackageBookingResponse;
import com.rajawarama.backend.dto.booking.SetTransportPriceRequest;
import com.rajawarama.backend.entity.*;
import com.rajawarama.backend.enums.RequestStatus;
import com.rajawarama.backend.exception.BadRequestException;
import com.rajawarama.backend.exception.ResourceNotFoundException;
import com.rajawarama.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DancingPackageBookingService {

    private final RequestDancingPackageRepository bookingRepository;
    private final UserRepository userRepository;
    private final DancingGroupPackageRepository dancingPackageRepository;
    private final DancingPerformerTypeRepository performerTypeRepository;

    // -------------------------------------
    // CUSTOMER - Create a new booking
    // -------------------------------------
    @Transactional
    public DancingPackageBookingResponse createBooking(
            String userEmail,
            CreateDancingPackageBookingRequest request
    ) {
        // 1. Load user
        User user = userRepository.findByEmailAndIsDeletedFalse(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        // 2. Load dancing package
        DancingGroupPackage dancingPackage = dancingPackageRepository
                .findById(request.getDancingPackageId())
                .orElseThrow(() -> new ResourceNotFoundException("Dancing package not found!"));

        // 3. Prevent duplicate active bookings
        boolean hasDuplicate = bookingRepository.existsByUserAndDancingPackageIdAndStatusIn(
                user,
                dancingPackage.getId(),
                List.of(RequestStatus.PENDING, RequestStatus.PRICE_SET, RequestStatus.ACCEPTED_WITH_PRICE)
        );
        if (hasDuplicate) {
            throw new BadRequestException(
                    "You already have an active booking for this dancing package. " +
                            "Please cancel the existing one before submitting a new request."
            );
        }

        // 4. Build main entity
        RequestDancingPackage booking = new RequestDancingPackage();
        booking.setUser(user);
        booking.setDancingPackage(dancingPackage);
        booking.setHotelName(request.getHotelName());
        booking.setNearestCity(request.getNearestCity());
        booking.setEventDate(request.getEventDate());
        booking.setContactNo(request.getContactNo());
        booking.setGroomArrivalTime(request.getGroomArrivalTime());
        booking.setPoruwaStartTime(request.getPoruwaStartTime());
        booking.setSpecialNotes(request.getSpecialNotes());
        booking.setStatus(RequestStatus.PENDING);

        // 5. Extra performers
        double extraPerformersTotal = 0.0;
        if (request.getExtraPerformers() != null) {
            for (CreateDancingPackageBookingRequest.ExtraPerformerEntry entry
                    : request.getExtraPerformers()) {
                DancingPerformerType performerType = performerTypeRepository
                        .findById(entry.getPerformerTypeId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Performer type not found: " + entry.getPerformerTypeId()));

                DancingRequestExtraPerformer extra = new DancingRequestExtraPerformer();
                extra.setDancingRequest(booking);
                extra.setPerformerType(performerType);
                extra.setQuantity(entry.getQuantity());
                booking.getExtraPerformers().add(extra);

                double price = performerType.getPricePerUnit() != null
                        ? performerType.getPricePerUnit() : 0.0;
                int qty = entry.getQuantity() != null ? entry.getQuantity() : 0;
                extraPerformersTotal += price * qty;
            }
        }

        // 6. ---------------------- CALCULATE AND STORE bookingSubtotal
        //
        // Formula:
        //   bookingSubtotal = dancingPackage.totalPrice + extraPerformers total
        //
        double basePrice = dancingPackage.getTotalPrice() != null
                ? dancingPackage.getTotalPrice() : 0.0;
        double bookingSubtotal = basePrice + extraPerformersTotal;
        booking.setBookingSubtotal(bookingSubtotal);
        // grandTotal stays null until admin sets transport price

        return mapToResponse(bookingRepository.save(booking));
    }

    //-------------------------------------------------
    // CUSTOMER - Get my bookings
    //-------------------------------------------------
    public List<DancingPackageBookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmailAndIsDeletedFalse(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    //-------------------------------------------------
    // CUSTOMER: Get single booking
    //-------------------------------------------------
    public DancingPackageBookingResponse getMyBookingById(String userEmail, UUID requestId) {
        RequestDancingPackage booking = getBookingOrThrow(requestId);
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("Access denied");
        }
        return mapToResponse(booking);
    }

    //-------------------------------------------------
    // CUSTOMER: Cancel booking (only when PRICE_SET)
    //-------------------------------------------------
    @Transactional
    public DancingPackageBookingResponse cancelBooking(String userEmail, UUID requestId) {
        RequestDancingPackage booking = getBookingOrThrow(requestId);
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("Access denied!");
        }
        if (booking.getStatus() != RequestStatus.PRICE_SET) {
            throw new BadRequestException(
                    "You can only cancel a booking when the admin has set a price. " +
                            "Current status: " + booking.getStatus()
            );
        }
        booking.setStatus(RequestStatus.CANCELLED);
        return mapToResponse(bookingRepository.save(booking));
    }

    //-------------------------------------------------
    // CUSTOMER: Accept price
    //-------------------------------------------------
    @Transactional
    public DancingPackageBookingResponse acceptPrice(String userEmail, UUID requestId) {
        RequestDancingPackage booking = getBookingOrThrow(requestId);
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("Access denied");
        }
        if (booking.getStatus() != RequestStatus.PRICE_SET) {
            throw new BadRequestException(
                    "No price to accept yet. Current status: " + booking.getStatus()
            );
        }
        booking.setStatus(RequestStatus.ACCEPTED_WITH_PRICE);
        booking.setFinalPriceAccepted(true);
        return mapToResponse(bookingRepository.save(booking));
    }

    //-------------------------------------------------
    // ADMIN: Get all bookings
    //-------------------------------------------------
    public List<DancingPackageBookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    //-------------------------------------------------
    // ADMIN: Get booking by id
    //-------------------------------------------------
    public DancingPackageBookingResponse getBookingById(UUID requestId) {
        return mapToResponse(getBookingOrThrow(requestId));
    }

    //-------------------------------------------------
    // ADMIN: Set transport price (PENDING → PRICE_SET)
    //        Also calculates and stores grandTotal = bookingSubtotal + transport
    //-------------------------------------------------
    @Transactional
    public DancingPackageBookingResponse setTransportPrice(
            UUID requestId, SetTransportPriceRequest request
    ) {
        RequestDancingPackage booking = getBookingOrThrow(requestId);

        if (booking.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException(
                    "Transport price can only be set for PENDING requests. " +
                            "Current status: " + booking.getStatus()
            );
        }

        booking.setTransportPrice(request.getTransportPrice());

        // ----------------------- CALCULATE AND STORE grandTotal
        double subtotal  = booking.getBookingSubtotal() != null ? booking.getBookingSubtotal() : 0.0;
        double transport = request.getTransportPrice() != null ? request.getTransportPrice() : 0.0;
        booking.setGrandTotal(subtotal + transport);

        booking.setStatus(RequestStatus.PRICE_SET);
        return mapToResponse(bookingRepository.save(booking));
    }

    //-------------------------------------------------
    // ADMIN: Approve (ACCEPTED_WITH_PRICE → APPROVED)
    //-------------------------------------------------
    @Transactional
    public DancingPackageBookingResponse approveBooking(UUID requestId) {
        RequestDancingPackage booking = getBookingOrThrow(requestId);
        if (booking.getStatus() != RequestStatus.ACCEPTED_WITH_PRICE) {
            throw new BadRequestException(
                    "Can only approve bookings that the customer has accepted. " +
                            "Current status: " + booking.getStatus()
            );
        }
        booking.setStatus(RequestStatus.APPROVED);
        return mapToResponse(bookingRepository.save(booking));
    }

    //-------------------------------------------------
    // ADMIN: Reject (any active status → REJECTED)
    //-------------------------------------------------
    @Transactional
    public DancingPackageBookingResponse rejectBooking(UUID requestId) {
        RequestDancingPackage booking = getBookingOrThrow(requestId);
        List<RequestStatus> rejectable = List.of(
                RequestStatus.PENDING, RequestStatus.PRICE_SET, RequestStatus.ACCEPTED_WITH_PRICE
        );
        if (!rejectable.contains(booking.getStatus())) {
            throw new BadRequestException(
                    "Cannot reject a booking with status: " + booking.getStatus()
            );
        }
        booking.setStatus(RequestStatus.REJECTED);
        return mapToResponse(bookingRepository.save(booking));
    }

    //-------------------------------------------------
    // ADMIN: Complete (APPROVED → COMPLETED)
    //-------------------------------------------------
    @Transactional
    public DancingPackageBookingResponse completeBooking(UUID requestId) {
        RequestDancingPackage booking = getBookingOrThrow(requestId);
        if (booking.getStatus() != RequestStatus.APPROVED) {
            throw new BadRequestException(
                    "Can only complete APPROVED bookings. Current status: " + booking.getStatus()
            );
        }
        booking.setStatus(RequestStatus.COMPLETED);
        return mapToResponse(bookingRepository.save(booking));
    }

    //-------------------------------------------------
    // HELPER: load or throw
    //-------------------------------------------------
    private RequestDancingPackage getBookingOrThrow(UUID requestId) {
        return bookingRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + requestId));
    }

    //-------------------------------------------------
    // MAPPER: Entity → Response DTO
    //
    // NOTE: bookingSubtotal and grandTotal are READ DIRECTLY from the stored
    //       DB columns. They are NEVER recalculated here. This guarantees
    //       report consistency even if package prices change later.
    //-------------------------------------------------
    private DancingPackageBookingResponse mapToResponse(RequestDancingPackage b) {

        List<DancingPackageBookingResponse.ExtraPerformerResponse> extraResponses =
                b.getExtraPerformers().stream()
                        .map(e -> DancingPackageBookingResponse.ExtraPerformerResponse.builder()
                                .id(e.getId())
                                .performerTypeId(e.getPerformerType().getId())
                                .performerTypeName(e.getPerformerType().getName())
                                .pricePerUnit(e.getPerformerType().getPricePerUnit())
                                .quantity(e.getQuantity())
                                .build())
                        .collect(Collectors.toList());

        return DancingPackageBookingResponse.builder()
                .requestId(b.getRequestId())
                // User
                .userId(b.getUser().getUserId())
                .userFullName(b.getUser().getFullName())
                .userEmail(b.getUser().getEmail())
                .userPhone(b.getUser().getPhone())
                // Package
                .dancingPackageId(b.getDancingPackage().getId())
                .dancingPackageName(b.getDancingPackage().getName())
                .dancingPackageBasePrice(b.getDancingPackage().getTotalPrice())
                // ── Stored prices (read from DB, never recalculated) ──
                .bookingSubtotal(b.getBookingSubtotal())
                .grandTotal(b.getGrandTotal())
                // Event
                .hotelName(b.getHotelName())
                .nearestCity(b.getNearestCity())
                .eventDate(b.getEventDate())
                .contactNo(b.getContactNo())
                .groomArrivalTime(b.getGroomArrivalTime())
                .poruwaStartTime(b.getPoruwaStartTime())
                .specialNotes(b.getSpecialNotes())
                // Extras
                .extraPerformers(extraResponses)
                // Status
                .status(b.getStatus())
                .transportPrice(b.getTransportPrice())
                .finalPriceAccepted(b.isFinalPriceAccepted())
                // Timestamps
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}