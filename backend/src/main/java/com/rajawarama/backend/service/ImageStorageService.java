package com.rajawarama.backend.service;

import com.rajawarama.backend.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class ImageStorageService {

    private final Path uploadLocation;

    public ImageStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.uploadLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(uploadLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not create upload directory!", e);
        }
    }

    public String store(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        validateImageType(file);

        String originalName = StringUtils.cleanPath(file.getOriginalFilename());

        String extension = "";
        if (originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String newFileName = UUID.randomUUID() + extension;

        try {
            Path target = uploadLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return newFileName;   // return only filename
        } catch (IOException e) {
            throw new FileStorageException("Failed to store image!", e);
        }
    }

    public void delete(String fileName) {
        if (fileName == null) return;

        try {
            Path target = uploadLocation.resolve(fileName);
            Files.deleteIfExists(target);
        } catch (IOException e) {
            throw new FileStorageException("Failed to delete image!", e);
        }
    }

    private void validateImageType(MultipartFile file) {
        String type = file.getContentType();

        if (type == null ||
                !(type.equals("image/jpeg") ||
                        type.equals("image/png") ||
                        type.equals("image/webp") ||
                        type.equals("image/heif") ||
                        type.equals("image/heic")
        ))
        {
            throw new FileStorageException("Only JPG, PNG, WEBP, HEIC and HEIF images allowed");
        }
    }
}