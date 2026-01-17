package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.SpecialPackageRequest;
import com.rajawarama.backend.entity.SpecialPackage;
import com.rajawarama.backend.exception.ResourceNotFoundException;
import com.rajawarama.backend.repository.SpecialPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class SpecialPackageService {

    private final SpecialPackageRepository repository;

    public void createSpecialPackage(SpecialPackageRequest request) {

        SpecialPackage pkg = new SpecialPackage(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getDiscountPercentage()
        );

        pkg.setFreeOfChargeItems(request.getFreeOfChargeItems());

        repository.save(pkg);
    }

    public List<SpecialPackage> getAll() {
        return repository.findAll();
    }

    public void update(UUID id, SpecialPackageRequest request) {

        SpecialPackage pkg = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Special package not found!")
                );

        pkg.setName(request.getName());
        pkg.setDescription(request.getDescription());
        pkg.setFreeOfChargeItems(request.getFreeOfChargeItems());
        pkg.setPrice(request.getPrice());
        pkg.setDiscount(request.getDiscountPercentage());

        pkg.calculatePriceWithoutTransport();

        repository.save(pkg);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
