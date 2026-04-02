package com.rajawarama.backend.repository;

import com.rajawarama.backend.entity.RequestDancingPackage;
import com.rajawarama.backend.entity.User;
import com.rajawarama.backend.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RequestDancingPackageRepository extends JpaRepository<RequestDancingPackage, UUID> {

    List<RequestDancingPackage> findByUserOrderByCreatedAtDesc(User user);

    List<RequestDancingPackage> findAllByOrderByCreatedAtDesc();

    List<RequestDancingPackage> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    boolean existsByUserAndDancingPackageIdAndStatusIn(
            User user,
            UUID dancingPackageId,
            List<RequestStatus> statuses
    );
}