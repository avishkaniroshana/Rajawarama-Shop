package com.rajawarama.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dress_item")
@Getter
@Setter
@NoArgsConstructor
public class DressItem {

    @Id
    @Column(name = "dress_item_id", nullable = false, updatable = false)
    private UUID dressItemId;

    @Column(name = "dress_name", nullable = false)
    private String dressItemName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "quantity_(adult)")
    private Integer quantityAdult;

    @Column(name = "quantity_(page_boys)")
    private Integer quantityPageBoys;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public DressItem(String dressItemName, String imagePath, Category category) {
        this.dressItemId = UUID.randomUUID();
        this.dressItemName = dressItemName;
        this.imagePath = imagePath;
        this.category = category;
    }
}


