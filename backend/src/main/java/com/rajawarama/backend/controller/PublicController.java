package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.DancingGroupPackageResponse;
import com.rajawarama.backend.dto.DancingPerformerTypeResponse;
import com.rajawarama.backend.dto.DressItemResponse;
import com.rajawarama.backend.dto.SpecialPackageResponse;
import com.rajawarama.backend.service.DancingGroupPackageService;
import com.rajawarama.backend.service.DancingPerformerTypeService;
import com.rajawarama.backend.service.DressItemService;
import com.rajawarama.backend.service.SpecialPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final SpecialPackageService       specialPackageService;
    private final DancingGroupPackageService  dancingGroupPackageService;
    private final DressItemService            dressItemService;
    private final DancingPerformerTypeService dancingPerformerTypeService;  // ← ADDED

    // --------------------------- Special Packages
    // GET → http://localhost:8080/api/public/special-packages
    @GetMapping("/special-packages")
    public ResponseEntity<List<SpecialPackageResponse>> getSpecialPackages() {
        return ResponseEntity.ok(specialPackageService.getAll());
    }

    // ------------------------------------ Dancing Group Packages
    // GET → http://localhost:8080/api/public/dancing-packages
    @GetMapping("/dancing-packages")
    public ResponseEntity<List<DancingGroupPackageResponse>> getDancingPackages() {
        return ResponseEntity.ok(dancingGroupPackageService.getAllDancingGroupPackages());
    }

    // --------------------------------------------- Dress Items
    // GET → http://localhost:8080/api/public/dress-items
    @GetMapping("/dress-items")
    public ResponseEntity<List<DressItemResponse>> getDressItems() {
        return ResponseEntity.ok(dressItemService.getAll());
    }

    // ----------------------------------------------- Performer Types (for booking modal → extra performers step)
    // GET → http://localhost:8080/api/public/performer-types
    @GetMapping("/performer-types")
    public ResponseEntity<List<DancingPerformerTypeResponse>> getPerformerTypes() {
        return ResponseEntity.ok(dancingPerformerTypeService.getAll());
    }
}

