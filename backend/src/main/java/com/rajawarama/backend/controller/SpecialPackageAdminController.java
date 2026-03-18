package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.ApiResponse;
import com.rajawarama.backend.dto.SpecialPackageRequest;
import com.rajawarama.backend.dto.SpecialPackageResponse;
import com.rajawarama.backend.service.SpecialPackageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/special-packages")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SpecialPackageAdminController {

    private final SpecialPackageService service;

    @PostMapping
    public ResponseEntity<SpecialPackageResponse> create(@Valid @RequestBody SpecialPackageRequest request) {
        return ResponseEntity.status(201).body(service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<SpecialPackageResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpecialPackageResponse> update(@PathVariable UUID id, @Valid @RequestBody SpecialPackageRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(new ApiResponse("Special package deleted successfully"));
    }
}
