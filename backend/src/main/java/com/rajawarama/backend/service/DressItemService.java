package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.DressItemResponse;
import com.rajawarama.backend.entity.Category;
import com.rajawarama.backend.entity.DressItem;
import com.rajawarama.backend.exception.BadRequestException;
import com.rajawarama.backend.repository.CategoryRepository;
import com.rajawarama.backend.repository.DressItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DressItemService {

    private final DressItemRepository dressItemRepository;
    private final CategoryRepository categoryRepository;
    private final ImageStorageService imageStorageService;

    //Create dress items for categories
    public DressItemResponse create(
            String dressName,
            UUID categoryId,
            MultipartFile image
    ) {

        if (dressItemRepository.findByDressItemName(dressName).isPresent()) {
            throw new BadRequestException("Dress item already exists!");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BadRequestException("Category not found!"));

        String fileName = imageStorageService.store(image);

        DressItem item = new DressItem(
                dressName,
                fileName,
                category
        );

        return map(dressItemRepository.save(item));
    }

    //Update dress items in categories

    public DressItemResponse update(
            UUID dressItemId,
            String dressName,
            UUID categoryId,
            MultipartFile image
    ) {

        DressItem item = dressItemRepository.findById(dressItemId)
                .orElseThrow(() -> new BadRequestException("Dress item not found!"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BadRequestException("Category not found!"));

        item.setDressItemName(dressName);
        item.setCategory(category);

        // If new image uploaded → delete old image
        if (image != null && !image.isEmpty()) {
            imageStorageService.delete(item.getImagePath());

            String newFileName = imageStorageService.store(image);
            item.setImagePath(newFileName);
        }

        return map(dressItemRepository.save(item));
    }

    //Get all items for category
    public List<DressItemResponse> getAll() {
        return dressItemRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    //Get item by id
    public DressItemResponse getById(UUID dressItemId) {
        DressItem item = dressItemRepository.findById(dressItemId)
                .orElseThrow(() -> new BadRequestException("Dress item not found!"));

        return map(item);
    }

    //Delete dress item
    public void delete(UUID dressItemId) {

        DressItem item = dressItemRepository.findById(dressItemId)
                .orElseThrow(() -> new BadRequestException("Dress item not found!"));

        // Delete image file
        imageStorageService.delete(item.getImagePath());

        dressItemRepository.delete(item);
    }

    // Mapper method to map DressItem to DressItemResponse
    private DressItemResponse map(DressItem item) {
        return DressItemResponse.builder()
                .dressItemId(item.getDressItemId())
                .dressItemName(item.getDressItemName())
                .imagePath(
                        item.getImagePath() != null
                                ? "/api/images/" + item.getImagePath()
                                : null
                )
                .categoryId(item.getCategory().getCategoryId())
                .categoryName(item.getCategory().getName())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}