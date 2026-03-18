package com.rajawarama.backend.repository;

import com.rajawarama.backend.entity.SpecialItemType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SpecialItemTypeRepository extends JpaRepository<SpecialItemType, UUID> {

    Optional<SpecialItemType> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}