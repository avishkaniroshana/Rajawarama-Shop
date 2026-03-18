package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.ApiResponse;
import com.rajawarama.backend.dto.SpecialItemTypeRequest;
import com.rajawarama.backend.dto.SpecialItemTypeResponse;
import com.rajawarama.backend.service.SpecialItemTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/special-item-types")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SpecialItemTypeAdminController {

    private final SpecialItemTypeService service;

    @PostMapping
    public ResponseEntity<SpecialItemTypeResponse> create(@Valid @RequestBody SpecialItemTypeRequest request) {
        return ResponseEntity.status(201).body(service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<SpecialItemTypeResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpecialItemTypeResponse> update(@PathVariable UUID id, @Valid @RequestBody SpecialItemTypeRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(new ApiResponse("Special item type deleted successfully"));
    }
}