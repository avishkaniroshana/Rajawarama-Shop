package com.rajawarama.backend.repository;

import com.rajawarama.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmailAndIsDeletedFalse(String email);
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

}
