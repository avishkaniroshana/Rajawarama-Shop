package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.DancingGroupPackageRequest;
import com.rajawarama.backend.entity.DancingGroupPackage;
import com.rajawarama.backend.exception.BadRequestException;
import com.rajawarama.backend.exception.ResourceNotFoundException;
import com.rajawarama.backend.repository.DancingGroupPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DancingGroupPackageService {
    private final DancingGroupPackageRepository dancingGroupPackageRepository;

    public void createDancingGroupPackage(DancingGroupPackageRequest request) {
        if (dancingGroupPackageRepository.findByNameIgnoreCase(request.getName()).isPresent()) {
            throw new BadRequestException("Package name already exists in the collection!");
        }
        DancingGroupPackage pkg = new DancingGroupPackage(
                request.getName(),
                request.getDetails(),
                request.getPrice()
        );
        dancingGroupPackageRepository.save(pkg);
    }


    public List<DancingGroupPackage> getAllDancingGroupPackages() {
        Sort sortingPackages = Sort.by(Sort.Direction.ASC, "price");
        return dancingGroupPackageRepository.findAll(sortingPackages);
    }

    public void updateDancingGroupPackage(UUID id, DancingGroupPackageRequest dancingGroupPackageRequest){
        DancingGroupPackage pkg = dancingGroupPackageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dancing group package not founded!"));

        if(!pkg.getName().equalsIgnoreCase(dancingGroupPackageRequest.getName())) {
            if(dancingGroupPackageRepository.findByNameIgnoreCase(dancingGroupPackageRequest.getName()).isPresent()){
                throw new BadRequestException("Package name already exists in the collection!");
            }
        }

        pkg.setName(dancingGroupPackageRequest.getName());
        pkg.setDetails(dancingGroupPackageRequest.getDetails());
        pkg.setPrice(dancingGroupPackageRequest.getPrice());

        dancingGroupPackageRepository.save(pkg);
    }


    public void deleteDancingGroupPackage(UUID id) {
        if(!dancingGroupPackageRepository.existsById(id)){
            throw new ResourceNotFoundException("Dancing group package not founded to delete!");
        }
        dancingGroupPackageRepository.deleteById(id);
    }

}
