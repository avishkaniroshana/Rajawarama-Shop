package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.DancingPerformerTypeRequest;
import com.rajawarama.backend.dto.DancingPerformerTypeResponse;
import com.rajawarama.backend.entity.DancingPerformerType;
import com.rajawarama.backend.exception.BadRequestException;
import com.rajawarama.backend.exception.ResourceNotFoundException;
import com.rajawarama.backend.repository.DancingPerformerTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DancingPerformerTypeService {

    private final DancingPerformerTypeRepository repository;

    public DancingPerformerTypeResponse create(DancingPerformerTypeRequest req) {
        if (repository.findByNameIgnoreCase(req.getName()).isPresent()) {
            throw new BadRequestException("Performer type with this name already exists!");
        }

        DancingPerformerType type = new DancingPerformerType(
                req.getName(),
                req.getPricePerUnit(),
                req.getMaxAvailable()
        );

        DancingPerformerType saved = repository.save(type);
        return map(saved);
    }

    public List<DancingPerformerTypeResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public DancingPerformerTypeResponse update(UUID id, DancingPerformerTypeRequest req) {
        DancingPerformerType type = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performer type not found with ID: " + id));

        // Only check name uniqueness if the name actually changed
        if (!type.getName().equalsIgnoreCase(req.getName()) &&
                repository.findByNameIgnoreCase(req.getName()).isPresent()) {
            throw new BadRequestException("Another performer type with this name already exists!");
        }

        type.setName(req.getName());
        type.setPricePerUnit(req.getPricePerUnit());
        type.setMaxAvailable(req.getMaxAvailable());

        DancingPerformerType saved = repository.save(type);
        return map(saved);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Performer type not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    private DancingPerformerTypeResponse map(DancingPerformerType t) {
        return DancingPerformerTypeResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .pricePerUnit(t.getPricePerUnit())
                .maxAvailable(t.getMaxAvailable())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}