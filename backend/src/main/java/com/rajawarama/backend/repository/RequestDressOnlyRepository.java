package com.rajawarama.backend.repository;

import com.rajawarama.backend.entity.RequestDressOnly;
import com.rajawarama.backend.entity.User;
import com.rajawarama.backend.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RequestDressOnlyRepository extends JpaRepository<RequestDressOnly, UUID> {
    List<RequestDressOnly> findByUserOrderByCreatedAtDesc(User user);
    List<RequestDressOnly> findAllByOrderByCreatedAtDesc();
    boolean existsByUserAndStatusIn(User user, List<RequestStatus> statuses);
}