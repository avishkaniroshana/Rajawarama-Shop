package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.CreateUserRequest;
import com.rajawarama.backend.dto.UpdateUserRequest;
import com.rajawarama.backend.dto.UserResponse;
import com.rajawarama.backend.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return adminUserService.getAllUsers();
    }

    @PostMapping
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        return adminUserService.createUser(request);
    }



    
    //fix re for creating soft deleted user





    @PutMapping("/{userId}")
    public UserResponse updateUser(
            @PathVariable UUID userId,
            @Valid@RequestBody UpdateUserRequest request
    ) {
        return adminUserService.updateUser(userId, request);
    }

    @DeleteMapping("/soft/{userId}")
    public ResponseEntity<Map<String, String>> softDelete(@PathVariable UUID userId) {
        adminUserService.softDeleteUser(userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User deactivated successfully");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/hard/{userId}")
    public ResponseEntity<Map<String, String>> hardDelete(@PathVariable UUID userId) {
        adminUserService.hardDeleteUser(userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User permanently deleted successfully");

        return ResponseEntity.ok(response);
    }

}
