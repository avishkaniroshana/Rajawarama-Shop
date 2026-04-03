package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.booking.CreateDressOnlyBookingRequest;
import com.rajawarama.backend.dto.booking.DressOnlyBookingResponse;
import com.rajawarama.backend.entity.*;
import com.rajawarama.backend.enums.DressRole;
import com.rajawarama.backend.enums.RequestStatus;
import com.rajawarama.backend.exception.BadRequestException;
import com.rajawarama.backend.exception.ResourceNotFoundException;
import com.rajawarama.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DressOnlyBookingService {

    private final RequestDressOnlyRepository bookingRepository;
    private final UserRepository userRepository;
    private final DressItemRepository dressItemRepository;

    @Value("${app.image.base-url:http://localhost:8080}")
    private String imageBaseUrl;

    //---------------------------------------
    // CUSTOMER: Create booking
    //-----------------------------------------
    @Transactional
    public DressOnlyBookingResponse createBooking(
            String userEmail,
            CreateDressOnlyBookingRequest request
    ) {
        User user = userRepository.findByEmailAndIsDeletedFalse(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        RequestDressOnly booking = new RequestDressOnly();
        booking.setUser(user);
        booking.setHotelName(request.getHotelName());
        booking.setNearestCity(request.getNearestCity());
        booking.setEventDate(request.getEventDate());
        booking.setContactNo(request.getContactNo());
        booking.setGroomArrivalTime(request.getGroomArrivalTime());
        booking.setPoruwaStartTime(request.getPoruwaStartTime());
        booking.setSpecialNotes(request.getSpecialNotes());
        booking.setStatus(RequestStatus.PENDING);

        // Build dress selections and calculate subtotal
        double subtotal = 0.0;

        for (CreateDressOnlyBookingRequest.DressSelectionEntry entry
                : request.getDressSelections()) {

            DressItem dressItem = dressItemRepository.findById(entry.getDressItemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Dress item not found: " + entry.getDressItemId()));

            RequestDressOnlySelection sel = new RequestDressOnlySelection();
            sel.setRequest(booking);
            sel.setDressItem(dressItem);
            sel.setRole(entry.getRole());
            sel.setQuantity(entry.getQuantity() != null ? entry.getQuantity() : 1);
            booking.getDressSelections().add(sel);

            // Add to subtotal using category-based price
            Double unitPrice = getPriceForRole(dressItem, entry.getRole());
            if (unitPrice != null && unitPrice > 0) {
                subtotal += unitPrice * sel.getQuantity();
            }
        }

        booking.setBookingSubtotal(subtotal);
        // grandTotal stays null until admin sets transport price

        return mapToResponse(bookingRepository.save(booking));
    }

    // ------------------------------------------------
    // CUSTOMER: Get my bookings
    // ------------------------------------------------
    public List<DressOnlyBookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmailAndIsDeletedFalse(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // ------------------------------------------------
    // CUSTOMER: Get single booking
    // ------------------------------------------------
    public DressOnlyBookingResponse getMyBookingById(String userEmail, UUID requestId) {
        RequestDressOnly booking = getOrThrow(requestId);
        if (userEmail != null && !booking.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("Access denied");
        }
        return mapToResponse(booking);
    }

    // ------------------------------------------------
    // CUSTOMER: Cancel
    // ------------------------------------------------
    @Transactional
    public DressOnlyBookingResponse cancelBooking(String userEmail, UUID requestId) {
        RequestDressOnly booking = getOrThrow(requestId);
        if (!booking.getUser().getEmail().equals(userEmail))
            throw new BadRequestException("Access denied");
        if (!List.of(RequestStatus.PENDING, RequestStatus.PRICE_SET).contains(booking.getStatus()))
            throw new BadRequestException("Cannot cancel at status: " + booking.getStatus());
        booking.setStatus(RequestStatus.CANCELLED);
        return mapToResponse(bookingRepository.save(booking));
    }

    // ------------------------------------------------
    // CUSTOMER: Accept price
    // ------------------------------------------------
    @Transactional
    public DressOnlyBookingResponse acceptPrice(String userEmail, UUID requestId) {
        RequestDressOnly booking = getOrThrow(requestId);
        if (!booking.getUser().getEmail().equals(userEmail))
            throw new BadRequestException("Access denied");
        if (booking.getStatus() != RequestStatus.PRICE_SET)
            throw new BadRequestException("No price set yet. Status: " + booking.getStatus());
        booking.setStatus(RequestStatus.ACCEPTED_WITH_PRICE);
        booking.setFinalPriceAccepted(true);
        return mapToResponse(bookingRepository.save(booking));
    }

    // ------------------------------------------------
    // ADMIN: Get all
    // ------------------------------------------------
    public List<DressOnlyBookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // ------------------------------------------------
    // ADMIN: Get by ID (no email check)
    // ------------------------------------------------
    public DressOnlyBookingResponse getBookingById(UUID requestId) {
        return mapToResponse(getOrThrow(requestId));
    }

    // ------------------------------------------------
    // ADMIN: Set transport price → PRICE_SET
    // ------------------------------------------------
    @Transactional
    public DressOnlyBookingResponse setTransportPrice(UUID requestId, Double transportPrice) {
        RequestDressOnly booking = getOrThrow(requestId);
        if (booking.getStatus() != RequestStatus.PENDING)
            throw new BadRequestException(
                    "Transport price can only be set for PENDING requests. Status: " + booking.getStatus());
        booking.setTransportPrice(transportPrice);
        double sub       = booking.getBookingSubtotal() != null ? booking.getBookingSubtotal() : 0.0;
        double transport = transportPrice != null ? transportPrice : 0.0;
        booking.setGrandTotal(sub + transport);
        booking.setStatus(RequestStatus.PRICE_SET);
        return mapToResponse(bookingRepository.save(booking));
    }

    // ------------------------------------------------
    // ADMIN: Approve (ACCEPTED_WITH_PRICE → APPROVED)
    // ------------------------------------------------
    @Transactional
    public DressOnlyBookingResponse approveBooking(UUID requestId) {
        RequestDressOnly booking = getOrThrow(requestId);
        if (booking.getStatus() != RequestStatus.ACCEPTED_WITH_PRICE)
            throw new BadRequestException(
                    "Can only approve bookings the customer has accepted. Status: " + booking.getStatus());
        booking.setStatus(RequestStatus.APPROVED);
        return mapToResponse(bookingRepository.save(booking));
    }

    // ------------------------------------------------
    // ADMIN: Reject
    // ------------------------------------------------
    @Transactional
    public DressOnlyBookingResponse rejectBooking(UUID requestId) {
        RequestDressOnly booking = getOrThrow(requestId);
        List<RequestStatus> rejectable = List.of(
                RequestStatus.PENDING,
                RequestStatus.PRICE_SET,
                RequestStatus.ACCEPTED_WITH_PRICE
        );
        if (!rejectable.contains(booking.getStatus()))
            throw new BadRequestException("Cannot reject booking with status: " + booking.getStatus());
        booking.setStatus(RequestStatus.REJECTED);
        return mapToResponse(bookingRepository.save(booking));
    }

    // ------------------------------------------------
    // ADMIN: Complete (APPROVED → COMPLETED)
    // ------------------------------------------------
    @Transactional
    public DressOnlyBookingResponse completeBooking(UUID requestId) {
        RequestDressOnly booking = getOrThrow(requestId);
        if (booking.getStatus() != RequestStatus.APPROVED)
            throw new BadRequestException(
                    "Can only complete APPROVED bookings. Status: " + booking.getStatus());
        booking.setStatus(RequestStatus.COMPLETED);
        return mapToResponse(bookingRepository.save(booking));
    }

    // ------------------------------------------------
    // HELPER: Get price from category based on role
    // ------------------------------------------------
    private Double getPriceForRole(DressItem item, DressRole role) {
        Category cat = item.getCategory();
        if (cat == null) return null;
        return switch (role) {
            case GROOM    -> cat.getGroomDressPrice();
            case BEST_MAN -> cat.getBestmanDressPrice();
            case PAGE_BOY -> cat.getPageBoyDressPrice();
        };
    }

    // ------------------------------------------------
    // HELPER: Load or throw
    // ------------------------------------------------
    private RequestDressOnly getOrThrow(UUID id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dress-only booking not found: " + id));
    }

    // ------------------------------------------------
    // MAPPER: Entity → Response DTO
    // ------------------------------------------------
    private DressOnlyBookingResponse mapToResponse(RequestDressOnly b) {

        List<DressOnlyBookingResponse.DressSelectionResponse> sels =
                b.getDressSelections().stream().map(s -> {
                    Category cat  = s.getDressItem().getCategory();
                    Double unitPx = getPriceForRole(s.getDressItem(), s.getRole());
                    double lineT  = unitPx != null ? unitPx * s.getQuantity() : 0.0;
                    return DressOnlyBookingResponse.DressSelectionResponse.builder()
                            .selectionId(s.getSelectionId())
                            .dressItemId(s.getDressItem().getDressItemId())
                            .dressItemName(s.getDressItem().getDressItemName())
                            .categoryName(cat != null ? cat.getName() : null)
                            .categoryGroomDressPrice(cat != null ? cat.getGroomDressPrice()   : null)
                            .categoryBestmanDressPrice(cat != null ? cat.getBestmanDressPrice(): null)
                            .categoryPageBoyDressPrice(cat != null ? cat.getPageBoyDressPrice(): null)
                            .role(s.getRole())
                            .quantity(s.getQuantity())
                            .unitPrice(unitPx)
                            .lineTotal(lineT)
                            .imageUrl(s.getDressItem().getImagePath() != null
                                    ? imageBaseUrl + "/api/images/" + s.getDressItem().getImagePath()
                                    : null)
                            .build();
                }).collect(Collectors.toList());

        return DressOnlyBookingResponse.builder()
                .requestId(b.getRequestId())
                .userId(b.getUser().getUserId())
                .userFullName(b.getUser().getFullName())
                .userEmail(b.getUser().getEmail())
                .userPhone(b.getUser().getPhone())
                .hotelName(b.getHotelName())
                .nearestCity(b.getNearestCity())
                .eventDate(b.getEventDate())
                .contactNo(b.getContactNo())
                .groomArrivalTime(b.getGroomArrivalTime())
                .poruwaStartTime(b.getPoruwaStartTime())
                .specialNotes(b.getSpecialNotes())
                .status(b.getStatus())
                .transportPrice(b.getTransportPrice())
                .bookingSubtotal(b.getBookingSubtotal())
                .grandTotal(b.getGrandTotal())
                .finalPriceAccepted(b.isFinalPriceAccepted())
                .dressSelections(sels)
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}