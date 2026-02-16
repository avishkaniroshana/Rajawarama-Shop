//package com.rajawarama.backend.repository;
//
//import com.rajawarama.backend.entity.DressItem;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//public interface DressItemRepository extends JpaRepository<DressItem, UUID> {
//
//    Optional<DressItem> findDressItemByName (String dressItemName);
//    List<DressItem> findByCategoryByCategoryId (UUID categoryId);
//
//}

package com.rajawarama.backend.repository;

import com.rajawarama.backend.entity.DressItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DressItemRepository extends JpaRepository<DressItem, UUID> {

    Optional<DressItem> findByDressItemName(String dressItemName);

}