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
@Table(name = "request_dress_only")
@Getter @Setter @NoArgsConstructor
public class RequestDressOnly {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "request_id", nullable = false, updatable = false)
    private UUID requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "contact_no", nullable = false)
    private String contactNo;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "hotel_name", nullable = false)
    private String hotelName;

    @Column(name = "nearest_city", nullable = false)
    private String nearestCity;

    @Column(name = "groom_arrival_time")
    private LocalTime groomArrivalTime;

    @Column(name = "poruwa_start_time")
    private LocalTime poruwaStartTime;

    @Column(name = "special_notes", columnDefinition = "TEXT")
    private String specialNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "transport_price")
    private Double transportPrice;

    @Column(name = "booking_subtotal")
    private Double bookingSubtotal = 0.0;

    @Column(name = "grand_total")
    private Double grandTotal;

    @Column(name = "final_price_accepted", nullable = false)
    private boolean finalPriceAccepted = false;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestDressOnlySelection> dressSelections = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
