package com.rajawarama.backend.entity;

import com.rajawarama.backend.enums.DressRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "request_dress_only_selections")
@Getter @Setter @NoArgsConstructor
public class RequestDressOnlySelection {

    @Id
    @UuidGenerator
    @Column(name = "selection_id", nullable = false, updatable = false)
    private UUID selectionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private RequestDressOnly request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dress_item_id", nullable = false)
    private DressItem dressItem;

    @Enumerated(EnumType.STRING)
    @Column(name = "dress_role", nullable = false)
    private DressRole role;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;
}