package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.ApiResponse;
import com.rajawarama.backend.dto.DancingPerformerTypeRequest;
import com.rajawarama.backend.dto.DancingPerformerTypeResponse;
import com.rajawarama.backend.service.DancingPerformerTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/dancing-performer-types")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDancingPerformerTypeController {

    private final DancingPerformerTypeService service;

    //POST->localhost:8080/api/admin/dancing-performer-types
    @PostMapping
    public ResponseEntity<DancingPerformerTypeResponse> create(@Valid @RequestBody DancingPerformerTypeRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    //GET->localhost:8080/api/admin/dancing-performer-types
    @GetMapping
    public List<DancingPerformerTypeResponse> getAll() {
        return service.getAll();
    }


    //PUT->localhost:8080/api/admin/dancing-performer-types/{id}
    @PutMapping("/{id}")
    public ResponseEntity<DancingPerformerTypeResponse> update(@PathVariable UUID id, @Valid @RequestBody DancingPerformerTypeRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    //DELETE->localhost:8080/api/admin/dancing-performer-types/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(new ApiResponse("Performer type deleted successfully"));
    }
}