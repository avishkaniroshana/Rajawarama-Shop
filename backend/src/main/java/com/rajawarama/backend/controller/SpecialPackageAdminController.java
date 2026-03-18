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
public class SpecialPackageAdminControl {

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





//1111111111111111111111111111111111111111111111111111



//package com.rajawarama.backend.controller;
//
//import com.rajawarama.backend.dto.ApiResponse;
//import com.rajawarama.backend.dto.SpecialPackageRequest;
//import com.rajawarama.backend.entity.SpecialPackage;
//import com.rajawarama.backend.service.SpecialPackageService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/admin/special-package")
//@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
//public class SpecialPackageAdminControl {
//
//    private final SpecialPackageService specialPackageService;
//
//    //POST -> http://localhost:8080/api/admin/special-package
//    @PostMapping
//    public ResponseEntity<ApiResponse> createSpecialPackage(
//            @Valid @RequestBody SpecialPackageRequest request
//    ) {
//        specialPackageService.createSpecialPackage(request);
//        return ResponseEntity.ok(
//                new ApiResponse("Special package created successfully")
//        );
//    }
//
//    //GET -> http://localhost:8080/api/admin/special-package
//    @GetMapping
//    public List<SpecialPackage> getAll() {
//        return specialPackageService.getAll();
//    }
//
//    //PUT -> http://localhost:8080/api/admin/special-package/{id}
//    @PutMapping("/{id}")
//    public ResponseEntity<ApiResponse> update(
//            @PathVariable UUID id,
//            @Valid @RequestBody SpecialPackageRequest request
//    ) {
//        specialPackageService.update(id, request);
//        return ResponseEntity.ok(
//                new ApiResponse("Special package updated successfully")
//        );
//    }
//
//    //DELETE -> http://localhost:8080/api/admin/special-package/{id}
//    @DeleteMapping("/{id}")
//    public ResponseEntity<ApiResponse> delete(@PathVariable UUID id) {
//        specialPackageService.delete(id);
//        return ResponseEntity.ok(
//                new ApiResponse("Special package deleted successfully")
//        );
//    }
//}
//
