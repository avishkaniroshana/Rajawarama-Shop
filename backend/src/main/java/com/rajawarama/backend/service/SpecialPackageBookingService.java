package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.booking.CreateSpecialPackageBookingRequest;
import com.rajawarama.backend.dto.booking.SetTransportPriceRequest;
import com.rajawarama.backend.dto.booking.SpecialPackageBookingResponse;
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
public class SpecialPackageBookingService {

    private final RequestSpecialPackageRepository bookingRepository;
    private final UserRepository userRepository;
    private final SpecialPackageRepository specialPackageRepository;
    private final DressItemRepository dressItemRepository;
    private final DancingGroupPackageRepository dancingPackageRepository;
    private final DancingPerformerTypeRepository performerTypeRepository;

    // -----------------------------------------
    // CUSTOMER: Create a new booking
    // -----------------------------------------
    @Transactional
    public SpecialPackageBookingResponse createBooking(
            String userEmail,
            CreateSpecialPackageBookingRequest request
    ) {
        // 1. Load user
        User user = userRepository.findByEmailAndIsDeletedFalse(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        // 2. Load special package
        SpecialPackage specialPackage = specialPackageRepository
                .findById(request.getSpecialPackageId())
                .orElseThrow(() -> new ResourceNotFoundException("Special package not found!"));

        // 3. Prevent duplicate active bookings
        boolean hasDuplicate = bookingRepository.existsByUserAndSpecialPackageIdAndStatusIn(
                user,
                specialPackage.getId(),
                List.of(RequestStatus.PENDING, RequestStatus.PRICE_SET, RequestStatus.ACCEPTED_WITH_PRICE)
        );
        if (hasDuplicate) {
            throw new BadRequestException(
                    "You already have an active booking for this package. " +
                            "Please cancel the existing one before submitting a new request."
            );
        }

        // 4. Build main entity
        RequestSpecialPackage booking = new RequestSpecialPackage();
        booking.setUser(user);
        booking.setSpecialPackage(specialPackage);
        booking.setHotelName(request.getHotelName());
        booking.setNearestCity(request.getNearestCity());
        booking.setEventDate(request.getEventDate());
        booking.setContactNo(request.getContactNo());
        booking.setGroomArrivalTime(request.getGroomArrivalTime());
        booking.setPoruwaStartTime(request.getPoruwaStartTime());
        booking.setSpecialNotes(request.getSpecialNotes());
        booking.setStatus(RequestStatus.PENDING);

        // 5. Resolve dancing package
        DancingGroupPackage resolvedDancingPackage = null;
        if (request.getOverrideDancingPackageId() != null) {
            resolvedDancingPackage = dancingPackageRepository
                    .findById(request.getOverrideDancingPackageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dancing package not found"));
        } else if (specialPackage.getLinkedDancingPackage() != null) {
            resolvedDancingPackage = specialPackage.getLinkedDancingPackage();
        }
        booking.setSelectedDancingPackage(resolvedDancingPackage);

        // 6. Dress selections
        if (request.getDressSelections() != null) {
            for (CreateSpecialPackageBookingRequest.DressSelectionEntry entry
                    : request.getDressSelections()) {
                DressItem dressItem = dressItemRepository.findById(entry.getDressItemId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Dress item not found: " + entry.getDressItemId()));
                RequestDressSelection selection = new RequestDressSelection();
                selection.setRequest(booking);
                selection.setRole(entry.getRole());
                selection.setDressItem(dressItem);
                booking.getDressSelections().add(selection);
            }
        }

        // 7. Extra performers
        if (request.getExtraPerformers() != null) {
            for (CreateSpecialPackageBookingRequest.ExtraPerformerEntry entry
                    : request.getExtraPerformers()) {
                DancingPerformerType performerType = performerTypeRepository
                        .findById(entry.getPerformerTypeId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Performer type not found: " + entry.getPerformerTypeId()));
                RequestExtraPerformer extra = new RequestExtraPerformer();
                extra.setRequest(booking);
                extra.setPerformerType(performerType);
                extra.setQuantity(entry.getQuantity());
                booking.getExtraPerformers().add(extra);
            }
        }

        // 8. ── CALCULATE AND STORE bookingSubtotal ──────────────────────────
        //
        // Formula:
        //   bookingSubtotal = specialPackage.finalPrice
        //                   + (selectedDancing.price - defaultDancing.price)  ← dancing adjustment
        //                   + sum(extraPerformers price × quantity)
        //
        double basePackagePrice = specialPackage.getFinalPrice() != null
                ? specialPackage.getFinalPrice() : 0.0;

        double defaultDancingPrice = 0.0;
        if (specialPackage.getLinkedDancingPackage() != null
                && specialPackage.getLinkedDancingPackage().getTotalPrice() != null) {
            defaultDancingPrice = specialPackage.getLinkedDancingPackage().getTotalPrice();
        }

        double selectedDancingPrice = 0.0;
        if (resolvedDancingPackage != null && resolvedDancingPackage.getTotalPrice() != null) {
            selectedDancingPrice = resolvedDancingPackage.getTotalPrice();
        }

        double dancingAdjustment = selectedDancingPrice - defaultDancingPrice;

        double extraPerformersTotal = 0.0;
        if (request.getExtraPerformers() != null) {
            for (CreateSpecialPackageBookingRequest.ExtraPerformerEntry entry
                    : request.getExtraPerformers()) {
                DancingPerformerType pt = performerTypeRepository
                        .findById(entry.getPerformerTypeId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Performer type not found: " + entry.getPerformerTypeId()));
                extraPerformersTotal += (pt.getPricePerUnit() != null ? pt.getPricePerUnit() : 0.0)
                        * (entry.getQuantity() != null ? entry.getQuantity() : 0);
            }
        }

        double bookingSubtotal = basePackagePrice + dancingAdjustment + extraPerformersTotal;
        booking.setBookingSubtotal(bookingSubtotal);
        // grandTotal stays null until admin sets transport price

        return mapToResponse(bookingRepository.save(booking));
    }

    // -----------------------------------------
    // CUSTOMER: Get my bookings
    // -----------------------------------------
    public List<SpecialPackageBookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmailAndIsDeletedFalse(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // -----------------------------------------
    // CUSTOMER: Get single booking
    // -----------------------------------------
    public SpecialPackageBookingResponse getMyBookingById(String userEmail, UUID requestId) {
        RequestSpecialPackage booking = getBookingOrThrow(requestId);
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("Access denied");
        }
        return mapToResponse(booking);
    }

    // -----------------------------------------
    // CUSTOMER: Cancel booking (only when PRICE_SET)
    // -----------------------------------------

    @Transactional
    public SpecialPackageBookingResponse cancelBooking(String userEmail, UUID requestId) {
        RequestSpecialPackage booking = getBookingOrThrow(requestId);
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

    // -----------------------------------------
    // CUSTOMER: Accept price
    // -----------------------------------------
    @Transactional
    public SpecialPackageBookingResponse acceptPrice(String userEmail, UUID requestId) {
        RequestSpecialPackage booking = getBookingOrThrow(requestId);
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

    // -----------------------------------------
    // ADMIN: Get all bookings
    // -----------------------------------------

    public List<SpecialPackageBookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // -----------------------------------------
    // ADMIN: Get booking by id
    // -----------------------------------------
    public SpecialPackageBookingResponse getBookingById(UUID requestId) {
        return mapToResponse(getBookingOrThrow(requestId));
    }

    // -----------------------------------------
    // ADMIN: Set transport price (PENDING → PRICE_SET)
    //        Also calculates and stores grandTotal = bookingSubtotal + transport
    // -----------------------------------------
    @Transactional
    public SpecialPackageBookingResponse setTransportPrice(
            UUID requestId, SetTransportPriceRequest request
    ) {
        RequestSpecialPackage booking = getBookingOrThrow(requestId);

        if (booking.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException(
                    "Transport price can only be set for PENDING requests. " +
                            "Current status: " + booking.getStatus()
            );
        }

        booking.setTransportPrice(request.getTransportPrice());

        // ─---------------------CALCULATE AND STORE grandTotal
        double subtotal = booking.getBookingSubtotal() != null ? booking.getBookingSubtotal() : 0.0;
        double transport = request.getTransportPrice() != null ? request.getTransportPrice() : 0.0;
        booking.setGrandTotal(subtotal + transport);

        booking.setStatus(RequestStatus.PRICE_SET);
        return mapToResponse(bookingRepository.save(booking));
    }

    // -----------------------------------------
    // ADMIN: Approve (ACCEPTED_WITH_PRICE → APPROVED)
    // -----------------------------------------
    @Transactional
    public SpecialPackageBookingResponse approveBooking(UUID requestId) {
        RequestSpecialPackage booking = getBookingOrThrow(requestId);
        if (booking.getStatus() != RequestStatus.ACCEPTED_WITH_PRICE) {
            throw new BadRequestException(
                    "Can only approve bookings that the customer has accepted. " +
                            "Current status: " + booking.getStatus()
            );
        }
        booking.setStatus(RequestStatus.APPROVED);
        return mapToResponse(bookingRepository.save(booking));
    }

    // -----------------------------------------
    // ADMIN: Reject (any active status → REJECTED)
    // -----------------------------------------
    @Transactional
    public SpecialPackageBookingResponse rejectBooking(UUID requestId) {
        RequestSpecialPackage booking = getBookingOrThrow(requestId);
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

    // -----------------------------------------
    // ADMIN: Complete (APPROVED → COMPLETED)
    // -----------------------------------------
    @Transactional
    public SpecialPackageBookingResponse completeBooking(UUID requestId) {
        RequestSpecialPackage booking = getBookingOrThrow(requestId);
        if (booking.getStatus() != RequestStatus.APPROVED) {
            throw new BadRequestException(
                    "Can only complete APPROVED bookings. Current status: " + booking.getStatus()
            );
        }
        booking.setStatus(RequestStatus.COMPLETED);
        return mapToResponse(bookingRepository.save(booking));
    }

    // -----------------------------------------
    // HELPER: load or throw
    // -----------------------------------------
    private RequestSpecialPackage getBookingOrThrow(UUID requestId) {
        return bookingRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + requestId));
    }

    // -----------------------------------------
    // MAPPER: Entity → Response DTO
    //
    // NOTE: bookingSubtotal and grandTotal are READ DIRECTLY from the stored
    //       DB columns. They are NEVER recalculated here. This guarantees
    //       report consistency even if package prices change later.
    // -----------------------------------------
    private SpecialPackageBookingResponse mapToResponse(RequestSpecialPackage b) {

        // Dress selections
        List<SpecialPackageBookingResponse.DressSelectionResponse> dressResponses =
                b.getDressSelections().stream()
                        .map(s -> SpecialPackageBookingResponse.DressSelectionResponse.builder()
                                .id(s.getId())
                                .role(s.getRole())
                                .dressItemId(s.getDressItem().getDressItemId())
                                .dressItemName(s.getDressItem().getDressItemName())
                                .categoryName(s.getDressItem().getCategory() != null
                                        ? s.getDressItem().getCategory().getName() : null)
                                .imagePath(s.getDressItem().getImagePath())
                                .build())
                        .collect(Collectors.toList());

        // Dancing package summary
        SpecialPackageBookingResponse.DancingPackageSummary dancingSummary = null;
        if (b.getSelectedDancingPackage() != null) {
            dancingSummary = SpecialPackageBookingResponse.DancingPackageSummary.builder()
                    .id(b.getSelectedDancingPackage().getId())
                    .name(b.getSelectedDancingPackage().getName())
                    .totalPrice(b.getSelectedDancingPackage().getTotalPrice())
                    .description(b.getSelectedDancingPackage().getDetails())
                    .build();
        }

        // Extra performers
        List<SpecialPackageBookingResponse.ExtraPerformerResponse> extraResponses =
                b.getExtraPerformers().stream()
                        .map(e -> SpecialPackageBookingResponse.ExtraPerformerResponse.builder()
                                .id(e.getId())
                                .performerTypeId(e.getPerformerType().getId())
                                .performerTypeName(e.getPerformerType().getName())
                                .pricePerUnit(e.getPerformerType().getPricePerUnit())
                                .quantity(e.getQuantity())
                                .build())
                        .collect(Collectors.toList());

        return SpecialPackageBookingResponse.builder()
                .requestId(b.getRequestId())
                // User
                .userId(b.getUser().getUserId())
                .userFullName(b.getUser().getFullName())
                .userEmail(b.getUser().getEmail())
                .userPhone(b.getUser().getPhone())
                // Package
                .specialPackageId(b.getSpecialPackage().getId())
                .specialPackageName(b.getSpecialPackage().getName())
                .specialPackageFinalPrice(b.getSpecialPackage().getFinalPrice())
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
                // Selections
                .dressSelections(dressResponses)
                .selectedDancingPackage(dancingSummary)
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
