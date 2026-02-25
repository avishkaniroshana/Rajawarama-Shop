package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.CreateDressItemRequest;
import com.rajawarama.backend.dto.DressItemResponse;
import com.rajawarama.backend.entity.Category;
import com.rajawarama.backend.entity.DressItem;
import com.rajawarama.backend.exception.BadRequestException;
import com.rajawarama.backend.exception.ResourceNotFoundException;
import com.rajawarama.backend.repository.CategoryRepository;
import com.rajawarama.backend.repository.DressItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DressItemService {

    private final DressItemRepository dressItemRepository;
    private final CategoryRepository categoryRepository;
    private final ImageStorageService imageStorageService;

    @Value("${app.image.base-url:http://localhost:8080}")
    private String imageBaseUrl;

    //Create a new dress item

    @Transactional
    public DressItemResponse create(CreateDressItemRequest request, MultipartFile image) {
        // Validate name uniqueness
        if (dressItemRepository.findByDressItemName(request.getDressItemName()).isPresent()) {
            throw new BadRequestException("Dress item name already exists!");
        }

        // Find category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        // Handle optional image upload
        String imagePath = null;
        if (image != null && !image.isEmpty()) {
            imagePath = imageStorageService.store(image);
        }

        // Create and populate entity
        DressItem item = new DressItem();
        item.setDressItemName(request.getDressItemName());
        item.setDescription(request.getDescription());
        item.setQuantityAdult(request.getQuantityAdult());
        item.setQuantityPageBoys(request.getQuantityPageBoys());
        item.setImagePath(imagePath);
        item.setCategory(category);

        // Save and return mapped response
        DressItem saved = dressItemRepository.save(item);
        return mapToResponse(saved);
    }

    //Update an existing dress item
    @Transactional
    public DressItemResponse update(UUID dressItemId, CreateDressItemRequest request, MultipartFile image) {
        // Find existing item
        DressItem item = dressItemRepository.findById(dressItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Dress item not found with ID: " + dressItemId));

        // Validate name uniqueness only if name changed
        if (!item.getDressItemName().equals(request.getDressItemName()) &&
                dressItemRepository.findByDressItemName(request.getDressItemName()).isPresent()) {
            throw new BadRequestException("Dress item name already exists!");
        }

        // Update category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        // Update core fields
        item.setDressItemName(request.getDressItemName());
        item.setDescription(request.getDescription());
        item.setQuantityAdult(request.getQuantityAdult());
        item.setQuantityPageBoys(request.getQuantityPageBoys());
        item.setCategory(category);

        // Handle image update (only if a new image is provided)
        if (image != null && !image.isEmpty()) {
            // Delete old image if it exists
            if (item.getImagePath() != null) {
                imageStorageService.delete(item.getImagePath());
            }
            // Store and set new image
            String newImagePath = imageStorageService.store(image);
            item.setImagePath(newImagePath);
        }
        // Note: If no new image is sent, old image remains unchanged

        // Save and return
        DressItem saved = dressItemRepository.save(item);
        return mapToResponse(saved);
    }

    //Get all dress items
    public List<DressItemResponse> getAll() {
        return dressItemRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    //Get single dress item by ID

    public DressItemResponse getById(UUID dressItemId) {
        DressItem item = dressItemRepository.findById(dressItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Dress item not found with ID: " + dressItemId));
        return mapToResponse(item);
    }


     //Delete dress item (including its image)
    @Transactional
    public void delete(UUID dressItemId) {
        DressItem item = dressItemRepository.findById(dressItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Dress item not found with ID: " + dressItemId));

        // Delete image if exists
        if (item.getImagePath() != null) {
            imageStorageService.delete(item.getImagePath());
        }

        dressItemRepository.delete(item);
    }

    //Map entity to DTO response

    private DressItemResponse mapToResponse(DressItem item) {
        return DressItemResponse.builder()
                .dressItemId(item.getDressItemId())
                .dressItemName(item.getDressItemName())
                .description(item.getDescription())
                .quantityAdult(item.getQuantityAdult())
                .quantityPageBoys(item.getQuantityPageBoys())
                .imagePath(
                        item.getImagePath() != null
                                ? "http://localhost:8080/api/images/" + item.getImagePath()   // ← absolute for dev
                                : null
                )
                .categoryId(item.getCategory().getCategoryId())
                .categoryName(item.getCategory().getName())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
