package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.SpecialItemTypeRequest;
import com.rajawarama.backend.dto.SpecialItemTypeResponse;
import com.rajawarama.backend.entity.SpecialItemType;
import com.rajawarama.backend.exception.BadRequestException;
import com.rajawarama.backend.exception.ResourceNotFoundException;
import com.rajawarama.backend.repository.SpecialItemTypeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecialItemTypeService {

    private final SpecialItemTypeRepository repository;

    @Transactional
    public SpecialItemTypeResponse create(SpecialItemTypeRequest request) {
        if (repository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Item type name already exists");
        }

        SpecialItemType type = new SpecialItemType();
        type.setName(request.getName());
        type.setPricePerUnit(request.getPricePerUnit());
        type.setMaxAvailable(request.getMaxAvailable() != null ? request.getMaxAvailable() : 999);

        SpecialItemType saved = repository.save(type);
        return mapToResponse(saved);
    }

    public List<SpecialItemTypeResponse> getAll() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SpecialItemTypeResponse update(UUID id, SpecialItemTypeRequest request) {
        SpecialItemType type = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Special item type not found"));

        if (!type.getName().equalsIgnoreCase(request.getName()) &&
                repository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Item type name already exists");
        }

        type.setName(request.getName());
        type.setPricePerUnit(request.getPricePerUnit());
        type.setMaxAvailable(request.getMaxAvailable() != null ? request.getMaxAvailable() : type.getMaxAvailable());

        SpecialItemType saved = repository.save(type);
        return mapToResponse(saved);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Special item type not found");
        }
        repository.deleteById(id);
    }

    private SpecialItemTypeResponse mapToResponse(SpecialItemType type) {
        return SpecialItemTypeResponse.builder()
                .id(type.getId())
                .name(type.getName())
                .pricePerUnit(type.getPricePerUnit())
                .maxAvailable(type.getMaxAvailable())
                .createdAt(type.getCreatedAt())
                .updatedAt(type.getUpdatedAt())
                .build();
    }
}
