package com.rajawarama.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "request_extra_performers")
@Getter
@Setter
@NoArgsConstructor
public class RequestExtraPerformer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "extra_performer_id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sp_request_id", nullable = false)
    private RequestSpecialPackage request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performer_type_id", nullable = false)
    private DancingPerformerType performerType;

    @Column(nullable = false)
    private Integer quantity = 1;
}