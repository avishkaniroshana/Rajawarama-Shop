package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.CategoryResponse;
import com.rajawarama.backend.dto.CreateCategoryRequest;
import com.rajawarama.backend.dto.UpdateCategoryRequest;
import com.rajawarama.backend.entity.Category;
import com.rajawarama.backend.exception.BadRequestException;
import com.rajawarama.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // ================= CREATE CATEGORY =================
    public CategoryResponse create(CreateCategoryRequest request) {

        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Category name already exists");
        }

        Category category = new Category(
                request.getName(),
                request.getDescription()
        );

        return map(categoryRepository.save(category));
    }

    // ================= GET ALL CATEGORIES =================
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    // ================= UPDATE CATEGORY =================
    public CategoryResponse update(UUID categoryId, UpdateCategoryRequest request) {

        // 1️⃣ Find category by ID
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BadRequestException("Category not found"));

        // 2️⃣ Check duplicate name (excluding current category)
        Category existingCategory =
                categoryRepository.findByName(request.getName()).orElse(null);

        if (existingCategory != null &&
                !existingCategory.getCategoryId().equals(categoryId)) {
            throw new BadRequestException("Category name already exists");
        }

        // 3️⃣ Update fields
        category.setName(request.getName());
        category.setDescription(request.getDescription());

        // 4️⃣ Save & return response
        return map(categoryRepository.save(category));
    }


    // ================= DELETE CATEGORY =================
    public void delete(UUID categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new BadRequestException("Category not found");
        }
        categoryRepository.deleteById(categoryId);
    }

    // ================= MAPPER =================
    private CategoryResponse map(Category category) {
        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
