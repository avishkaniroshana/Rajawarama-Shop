package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.CategoryResponse;
import com.rajawarama.backend.dto.CreateCategoryRequest;
import com.rajawarama.backend.dto.UpdateCategoryRequest;
import com.rajawarama.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {

    private final CategoryService categoryService;

    // ================= CREATE CATEGORY =================
    // POST http://localhost:8080/api/admin/categories
    @PostMapping
    public ResponseEntity<CategoryResponse> create(
            @Valid @RequestBody CreateCategoryRequest request
    ) {
        return ResponseEntity.ok(categoryService.create(request));
    }

    // ================= GET ALL CATEGORIES =================
    // GET http://localhost:8080/api/admin/categories
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    // ================= UPDATE CATEGORY =================
    // PUT http://localhost:8080/api/admin/categories/{categoryId}
    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable UUID categoryId,
            @Valid @RequestBody UpdateCategoryRequest request
    ) {
        return ResponseEntity.ok(categoryService.update(categoryId, request));
    }

    // ================= DELETE CATEGORY =================
    // DELETE http://localhost:8080/api/admin/categories/{categoryId}
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<?> delete(@PathVariable UUID categoryId) {
        categoryService.delete(categoryId);
        return ResponseEntity.ok(
                java.util.Map.of("message", "Category deleted successfully")
        );
    }
}
