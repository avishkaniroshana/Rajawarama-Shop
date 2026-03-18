package com.rajawarama.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "special_package")
@Getter
@Setter
@NoArgsConstructor
public class SpecialPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "special_package_id")
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description; // auto-generated

    @Column(nullable = true)
    private Double discountPercent = 0.0;

    @Column(nullable = true)
    private Double finalPrice; // calculated & stored

    private boolean weddingCoordinationIncluded = false;
    private boolean weddingPackagingIncluded = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dancing_package_id")
    private DancingGroupPackage linkedDancingPackage;

    @OneToMany(mappedBy = "specialPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SpecialPackageItem> items = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "special_package_free_items", joinColumns = @JoinColumn(name = "special_package_id"))
    @Column(name = "free_item_name")
    private List<String> freeItems = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void calculateFinalPriceAndDescription() {
        double total = 0.0;

        // Priced items
        for (SpecialPackageItem item : items) {
            if (item.getQuantity() != null && item.getSpecialItemType() != null) {
                total += item.getQuantity() * item.getSpecialItemType().getPricePerUnit();
            }
        }

        // Linked dancing package
        if (linkedDancingPackage != null && linkedDancingPackage.getTotalPrice() != null) {
            total += linkedDancingPackage.getTotalPrice();
        }


        double discountRate = 0;
        if (discountPercent != null) {
            discountRate = discountPercent / 100;   // e.g. 5 → 0.05
        }
        double keepPercentage = 1 - discountRate;   // e.g. 1 - 0.05 = 0.95
        total = total * keepPercentage;             // apply discount
        this.finalPrice = total;

        // Auto-generate description
        StringBuilder sb = new StringBuilder("Includes : \n");

        // Priced items
        for (SpecialPackageItem item : items) {
            SpecialItemType type = item.getSpecialItemType();
            if (type != null) {
                sb.append("• ")
                        .append(item.getQuantity())
                        .append(" × ")
                        .append(type.getName())
                        .append(" (Rs. ")
                        .append(String.format("%.0f", type.getPricePerUnit()))
                        .append(" each)\n");
            }
        }

        // Linked dancing package
        if (linkedDancingPackage != null) {
            sb.append("• Dancing Group Package : ")
                    .append(linkedDancingPackage.getName())
                    .append("\n");
        }

        // Flags
        if (weddingCoordinationIncluded) sb.append("• Wedding Coordination Included\n");
        if (weddingPackagingIncluded) sb.append("• Wedding Packaging Included\n");

        // Free items (custom + free dancing performers)
        if (!freeItems.isEmpty()) {
            sb.append("Free items :\n");
            for (String free : freeItems) {
                sb.append("• ").append(free).append("\n");
            }
        }

        sb.append("\nTotal estimated value: Rs. ").append(String.format("%.0f", finalPrice));

        this.description = sb.toString().trim();
    }
}
