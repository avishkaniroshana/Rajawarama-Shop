package com.rajawarama.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "special_package_item")
@Getter
@Setter
@NoArgsConstructor
public class SpecialPackageItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "special_package_id", nullable = false)
    private SpecialPackage specialPackage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "special_item_type_id", nullable = false)
    private SpecialItemType specialItemType;

    private Integer quantity = 1;
}

