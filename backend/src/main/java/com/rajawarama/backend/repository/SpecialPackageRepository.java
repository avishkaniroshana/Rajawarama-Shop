package com.rajawarama.backend.repository;

import com.rajawarama.backend.entity.SpecialPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SpecialPackageRepository extends JpaRepository<SpecialPackage, UUID> {
}
