package com.rajawarama.backend.repository;

import com.rajawarama.backend.entity.RequestSpecialPackage;
import com.rajawarama.backend.entity.User;
import com.rajawarama.backend.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RequestSpecialPackageRepository extends JpaRepository<RequestSpecialPackage, UUID> {

    // All requests by a specific user (for My Bookings page)
    List<RequestSpecialPackage> findByUserOrderByCreatedAtDesc(User user);

    // All requests by status (admin filtering)
    List<RequestSpecialPackage> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    // All requests ordered by newest (admin view all)
    List<RequestSpecialPackage> findAllByOrderByCreatedAtDesc();

    // Check if user already has a PENDING/PRICE_SET request for same date + package
    boolean existsByUserAndSpecialPackageIdAndStatusIn(
            User user,
            UUID specialPackageId,
            List<RequestStatus> statuses
    );
}