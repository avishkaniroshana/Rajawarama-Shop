package com.rajawarama.backend.repository;

import com.rajawarama.backend.entity.DancingGroupPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DancingGroupPackageRepository extends JpaRepository<DancingGroupPackage, UUID> {
    Optional<DancingGroupPackage> findByNameIgnoreCase(String name);
}
