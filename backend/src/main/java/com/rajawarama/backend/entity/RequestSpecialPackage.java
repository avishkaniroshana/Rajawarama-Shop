package com.rajawarama.backend.entity;

import com.rajawarama.backend.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "request_special_packages")
@Getter
@Setter
@NoArgsConstructor
public class RequestSpecialPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "sp_request_id", nullable = false, updatable = false)
    private UUID requestId;

    // -------------------------- user who made the request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ------------------------------- Which special package is being booked
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "special_package_id", nullable = false)
    private SpecialPackage specialPackage;

    // ---------------------------------------- Event details
    @Column(name = "hotel_name", nullable = false)
    private String hotelName;

    @Column(name = "nearest_city", nullable = false)
    private String nearestCity;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "contact_no", nullable = false)
    private String contactNo;

    @Column(name = "groom_arrival_time")
    private LocalTime groomArrivalTime;

    @Column(name = "poruwa_start_time")
    private LocalTime poruwaStartTime;

    @Column(name = "special_notes", columnDefinition = "TEXT")
    private String specialNotes;

    // ----------- Dress selections (Groom, Best Man(s), Page Boy(s))
    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestDressSelection> dressSelections = new ArrayList<>();

    // ----------- Dancing package (linked from special package OR user override)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_dancing_package_id")
    private DancingGroupPackage selectedDancingPackage;

    // ----------- Extra performers beyond the dancing package
    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestExtraPerformer> extraPerformers = new ArrayList<>();

    // ------------ Status & pricing
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    // ----------------------------- STORED PRICES
    // Calculated and stored at booking creation time.
    // bookingSubtotal = specialPackage.finalPrice + dancingAdjustment + extraPerformers
    @Column(name = "booking_subtotal", nullable = false)
    private Double bookingSubtotal = 0.0;

    // Set by admin (transport cost only)
    @Column(name = "transport_price")
    private Double transportPrice;

    // Calculated and stored when admin sets transport price.
    // grandTotal = bookingSubtotal + transportPrice
    @Column(name = "grand_total")
    private Double grandTotal;

    @Column(name = "final_price_accepted")
    private boolean finalPriceAccepted = false;

    // ------------------------- Timestamps
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}