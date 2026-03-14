package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.ApiResponse;
import com.rajawarama.backend.dto.DancingGroupPackageRequest;
import com.rajawarama.backend.dto.DancingGroupPackageResponse;
import com.rajawarama.backend.service.DancingGroupPackageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/dancing-package")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DancingGroupPackageAdminController {

    private final DancingGroupPackageService dancingGroupPackageService;

    // POST → http://localhost:8080/api/admin/dancing-package
    @PostMapping
    public ResponseEntity<DancingGroupPackageResponse> createDancingGroupPackage(
            @Valid @RequestBody DancingGroupPackageRequest request) {
        DancingGroupPackageResponse created = dancingGroupPackageService.createDancingGroupPackage(request);
        return ResponseEntity.status(201).body(created);
    }

    // GET → http://localhost:8080/api/admin/dancing-package
    @GetMapping
    public ResponseEntity<List<DancingGroupPackageResponse>> getAllDancingGroupPackages() {
        return ResponseEntity.ok(dancingGroupPackageService.getAllDancingGroupPackages());
    }

    // PUT → http://localhost:8080/api/admin/dancing-package/{id}
    @PutMapping("/{id}")
    public ResponseEntity<DancingGroupPackageResponse> updateDancingGroupPackage(
            @PathVariable UUID id,
            @Valid @RequestBody DancingGroupPackageRequest request) {
        DancingGroupPackageResponse updated = dancingGroupPackageService.updateDancingGroupPackage(id, request);
        return ResponseEntity.ok(updated);
    }

    // DELETE → http://localhost:8080/api/admin/dancing-package/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteDancingGroupPackage(@PathVariable UUID id) {
        dancingGroupPackageService.deleteDancingGroupPackage(id);
        return ResponseEntity.ok(new ApiResponse("Dancing group package deleted successfully"));
    }
}

