package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.DancingGroupPackageRequest;
import com.rajawarama.backend.dto.DancingGroupPackageResponse;
import com.rajawarama.backend.entity.DancingGroupPackage;
import com.rajawarama.backend.entity.DancingPerformerType;
import com.rajawarama.backend.exception.BadRequestException;
import com.rajawarama.backend.exception.ResourceNotFoundException;
import com.rajawarama.backend.repository.DancingGroupPackageRepository;
import com.rajawarama.backend.repository.DancingPerformerTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DancingGroupPackageService {

    private final DancingGroupPackageRepository dancingGroupPackageRepository;
    private final DancingPerformerTypeRepository performerTypeRepository;

    @Transactional
    public DancingGroupPackageResponse createDancingGroupPackage(DancingGroupPackageRequest request) {
        // Name uniqueness check
        if (dancingGroupPackageRepository.findByNameIgnoreCase(request.getName()).isPresent()) {
            throw new BadRequestException("Package name already exists!");
        }

        DancingGroupPackage pkg = new DancingGroupPackage();
        pkg.setName(request.getName());

        // Link performers and quantities
        if (request.getPerformers() != null && !request.getPerformers().isEmpty()) {
            for (var performerItem : request.getPerformers()) {
                DancingPerformerType type = performerTypeRepository.findById(performerItem.getPerformerTypeId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Performer type not found: " + performerItem.getPerformerTypeId()));

                pkg.getIncludedPerformers().add(type);

                if (performerItem.getQuantity() != null && performerItem.getQuantity() > 0) {
                    pkg.getQuantities().put(type.getId(), performerItem.getQuantity());
                } else {
                    throw new BadRequestException("Quantity must be positive for performer: " + type.getName());
                }
            }
        }

        // Update stored totalPrice and auto-generate details
        pkg.updateCalculatedFields();

        DancingGroupPackage saved = dancingGroupPackageRepository.save(pkg);
        return mapToResponse(saved);
    }

    public List<DancingGroupPackageResponse> getAllDancingGroupPackages() {
        // Sort by name (alphabetical) – safe field
        Sort sort = Sort.by(Sort.Direction.ASC, "name");

        return dancingGroupPackageRepository.findAll(sort)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DancingGroupPackageResponse updateDancingGroupPackage(UUID id, DancingGroupPackageRequest request) {
        DancingGroupPackage pkg = dancingGroupPackageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dancing group package not found with id: " + id));

        // Name uniqueness check (only if name changed)
        if (!pkg.getName().equalsIgnoreCase(request.getName())) {
            if (dancingGroupPackageRepository.findByNameIgnoreCase(request.getName()).isPresent()) {
                throw new BadRequestException("Package name already exists!");
            }
        }

        pkg.setName(request.getName());

        // Clear existing performers & quantities
        pkg.getIncludedPerformers().clear();
        pkg.getQuantities().clear();

        // Re-add performers and quantities
        if (request.getPerformers() != null && !request.getPerformers().isEmpty()) {
            for (var performerItem : request.getPerformers()) {
                DancingPerformerType type = performerTypeRepository.findById(performerItem.getPerformerTypeId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Performer type not found: " + performerItem.getPerformerTypeId()));

                pkg.getIncludedPerformers().add(type);

                if (performerItem.getQuantity() != null && performerItem.getQuantity() > 0) {
                    pkg.getQuantities().put(type.getId(), performerItem.getQuantity());
                } else {
                    throw new BadRequestException("Quantity must be positive for performer: " + type.getName());
                }
            }
        }

        // Update stored totalPrice and regenerate details
        pkg.updateCalculatedFields();

        DancingGroupPackage saved = dancingGroupPackageRepository.save(pkg);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteDancingGroupPackage(UUID id) {
        if (!dancingGroupPackageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Dancing group package not found with id: " + id);
        }
        dancingGroupPackageRepository.deleteById(id);
    }

    // Mapping helper – uses stored totalPrice
    private DancingGroupPackageResponse mapToResponse(DancingGroupPackage pkg) {
        List<DancingGroupPackageResponse.PerformerSummary> performerSummaries = new ArrayList<>();

        for (DancingPerformerType type : pkg.getIncludedPerformers()) {
            Integer qty = pkg.getQuantities().get(type.getId());
            if (qty != null && qty > 0) {
                performerSummaries.add(
                        DancingGroupPackageResponse.PerformerSummary.builder()
                                .id(type.getId())
                                .name(type.getName())
                                .pricePerUnit(type.getPricePerUnit())
                                .quantity(qty)
                                .build()
                );
            }
        }

        return DancingGroupPackageResponse.builder()
                .id(pkg.getId())
                .name(pkg.getName())
                .details(pkg.getDetails())           // auto-generated
                .totalPrice(pkg.getTotalPrice())     // now stored value
                .includedPerformers(performerSummaries)
                .createdAt(pkg.getCreatedAt())
                .updatedAt(pkg.getUpdatedAt())
                .build();
    }
}

