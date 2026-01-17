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
@Table(name = "special_package")
@Getter
@Setter
@NoArgsConstructor
public class SpecialPackage {
    @Id
    @Column(name = "special_package_id", nullable = false,updatable = false)
    private UUID id;

    @Column(name="special_package_name", nullable = false)
    private String name;

    @Column(name = "description",columnDefinition = "TEXT")
    private String description;

    @Column(name = "free_of_charge_items", nullable=true)
    private String freeOfChargeItems;

    @Column(name="price", nullable = false)
    private Double price;

    @Column(name="discount", nullable = false)
    private Double discount;

    @Column(name="price_without_transport", nullable = false)
    private Double priceWithoutTransport;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public SpecialPackage(
            String name,
            String description,
            Double price,
            Double discount
    ) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.description = description;
        this.price = price;
        this.discount = discount;
        calculatePriceWithoutTransport();
    }

    public void calculatePriceWithoutTransport() {
        this.priceWithoutTransport = price - ((discount/100)*price);
    }
}