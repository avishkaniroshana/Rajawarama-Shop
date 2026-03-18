package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.SpecialPackageRequest;
import com.rajawarama.backend.dto.SpecialPackageResponse;
import com.rajawarama.backend.entity.DancingGroupPackage;
import com.rajawarama.backend.entity.DancingPerformerType;
import com.rajawarama.backend.entity.SpecialItemType;
import com.rajawarama.backend.entity.SpecialPackage;
import com.rajawarama.backend.entity.SpecialPackageItem;
import com.rajawarama.backend.exception.BadRequestException;
import com.rajawarama.backend.exception.ResourceNotFoundException;
import com.rajawarama.backend.repository.DancingGroupPackageRepository;
import com.rajawarama.backend.repository.DancingPerformerTypeRepository;
import com.rajawarama.backend.repository.SpecialPackageRepository;
import com.rajawarama.backend.repository.SpecialItemTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecialPackageService {

    private final SpecialPackageRepository repository;
    private final DancingGroupPackageRepository dancingRepository;
    private final SpecialItemTypeRepository itemTypeRepository;
    private final DancingPerformerTypeRepository dancingPerformerTypeRepository;

    @Transactional
    public SpecialPackageResponse create(SpecialPackageRequest request) {
        if (repository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Package name already exists");
        }

        SpecialPackage pkg = new SpecialPackage();
        updateFromRequest(pkg, request);

        pkg.calculateFinalPriceAndDescription();
        SpecialPackage saved = repository.save(pkg);
        return mapToResponse(saved);
    }

    @Transactional
    public SpecialPackageResponse update(UUID id, SpecialPackageRequest request) {
        SpecialPackage pkg = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Special package not found"));

        if (!pkg.getName().equalsIgnoreCase(request.getName()) &&
                repository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Package name already exists");
        }

        updateFromRequest(pkg, request);

        pkg.calculateFinalPriceAndDescription();
        SpecialPackage saved = repository.save(pkg);
        return mapToResponse(saved);
    }

    private void updateFromRequest(SpecialPackage pkg, SpecialPackageRequest req) {
        pkg.setName(req.getName());
        pkg.setDiscountPercent(req.getDiscountPercent() != null ? req.getDiscountPercent() : 0);
        pkg.setWeddingCoordinationIncluded(req.isWeddingCoordinationIncluded());
        pkg.setWeddingPackagingIncluded(req.isWeddingPackagingIncluded());

        // Clear existing priced items
        pkg.getItems().clear();

        // Add priced items (lookup by ID)
        if (req.getItems() != null) {
            for (var entry : req.getItems()) {
                SpecialItemType type = itemTypeRepository.findById(entry.getSpecialItemTypeId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Special item type not found: " + entry.getSpecialItemTypeId()));

                SpecialPackageItem item = new SpecialPackageItem();
                item.setSpecialPackage(pkg);
                item.setSpecialItemType(type);
                item.setQuantity(entry.getQuantity());
                pkg.getItems().add(item);
            }
        }

        // Clear and add free custom items
        pkg.getFreeItems().clear();
        if (req.getFreeItems() != null) {
            pkg.getFreeItems().addAll(req.getFreeItems().stream()
                    .filter(s -> s != null && !s.trim().isEmpty())
                    .map(String::trim)
                    .collect(Collectors.toList()));
        }

        // Add free dancing performer types (by ID) → append their names to freeItems
        if (req.getFreeDancingPerformerTypeIds() != null && !req.getFreeDancingPerformerTypeIds().isEmpty()) {
            for (UUID performerId : req.getFreeDancingPerformerTypeIds()) {
                DancingPerformerType performer = dancingPerformerTypeRepository.findById(performerId)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Dancing performer type not found: " + performerId));

                pkg.getFreeItems().add(performer.getName());
            }
        }

        // Link dancing package
        if (req.getLinkedDancingPackageId() != null) {
            DancingGroupPackage dp = dancingRepository.findById(req.getLinkedDancingPackageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dancing package not found"));
            pkg.setLinkedDancingPackage(dp);
        } else {
            pkg.setLinkedDancingPackage(null);
        }
    }

    public List<SpecialPackageResponse> getAll() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Special package not found");
        }
        repository.deleteById(id);
    }

    private SpecialPackageResponse mapToResponse(SpecialPackage pkg) {
        List<SpecialPackageResponse.SpecialItemResponse> items = pkg.getItems().stream()
                .map(item -> SpecialPackageResponse.SpecialItemResponse.builder()
                        .id(item.getId())
                        .specialItemTypeId(item.getSpecialItemType().getId())
                        .specialItemTypeName(item.getSpecialItemType().getName())
                        .quantity(item.getQuantity())
                        .pricePerUnit(item.getSpecialItemType().getPricePerUnit())
                        .build())
                .collect(Collectors.toList());

        return SpecialPackageResponse.builder()
                .id(pkg.getId())
                .name(pkg.getName())
                .description(pkg.getDescription())
                .discountPercent(pkg.getDiscountPercent())
                .finalPrice(pkg.getFinalPrice())
                .weddingCoordinationIncluded(pkg.isWeddingCoordinationIncluded())
                .weddingPackagingIncluded(pkg.isWeddingPackagingIncluded())
                .linkedDancingPackageId(pkg.getLinkedDancingPackage() != null ? pkg.getLinkedDancingPackage().getId() : null)
                .linkedDancingPackageName(pkg.getLinkedDancingPackage() != null ? pkg.getLinkedDancingPackage().getName() : null)
                .items(items)
                .freeItems(pkg.getFreeItems()) // included in response
                .createdAt(pkg.getCreatedAt())
                .updatedAt(pkg.getUpdatedAt())
                .build();
    }
}
