package com.rajawarama.backend.repository;

import com.rajawarama.backend.entity.DancingPerformerType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface DancingPerformerTypeRepository extends JpaRepository<DancingPerformerType, UUID> {
    Optional<DancingPerformerType> findByNameIgnoreCase(String name);
}