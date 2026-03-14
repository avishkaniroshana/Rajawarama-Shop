package com.rajawarama.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dancing_performer_type")
@Getter
@Setter
@NoArgsConstructor
public class DancingPerformerType {

    @Id
    @Column(name = "performer_type_id", nullable = false, updatable = false)
    private UUID id = UUID.randomUUID();

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "price_per_unit", nullable = false)
    private Double pricePerUnit;

    @Column(name = "max_available", nullable = false)
    private Integer maxAvailable;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public DancingPerformerType(String name, Double pricePerUnit, Integer maxAvailable) {
        this.name = name;
        this.pricePerUnit = pricePerUnit;
        this.maxAvailable = maxAvailable;
    }
}
