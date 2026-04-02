package com.rajawarama.backend.entity;

import com.rajawarama.backend.enums.DressRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "request_dress_selections")
@Getter
@Setter
@NoArgsConstructor
public class RequestDressSelection {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "selection_id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sp_request_id", nullable = false)
    private RequestSpecialPackage request;

    // GROOM / BEST_MAN / PAGE_BOY
    @Enumerated(EnumType.STRING)
    @Column(name = "dress_role", nullable = false)
    private DressRole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dress_item_id", nullable = false)
    private DressItem dressItem;
}
 