package com.rajawarama.backend.controller;

import com.rajawarama.backend.dto.ApiResponse;
import com.rajawarama.backend.dto.ChangePasswordRequest;
import com.rajawarama.backend.dto.ProfileResponse;
import com.rajawarama.backend.dto.UpdateProfileRequest;
import com.rajawarama.backend.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService userProfileService;

    private String getEmail(){
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    //Details of logged in user
    //GET -> http://localhost:8080/api/profile
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @GetMapping
    public ProfileResponse getProfile(){
        return userProfileService.getProfile(getEmail());
    }


    //Update profile details (CUSTOMER & ADMIN can update profile)
    //PUT -> http://localhost:8080/api/profile
    @PreAuthorize(("hasAnyRole('CUSTOMER', 'ADMIN')"))
    @PutMapping
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request
            ){
        userProfileService.updateProfile(getEmail(), request);
        return ResponseEntity.ok(new ApiResponse("Profile updated successfully"));

    }

    //CUSTOMER & ADMIN can change password
    //PUT -> http://localhost:8080/api/profilepassword
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
            ){
                userProfileService.changePassword(getEmail(), request);
                return ResponseEntity.ok(new ApiResponse("Password changed successfully"));

    }

    //CUSTOMER & ADMIN can delete own account
    //DELETE -> http://localhost:8080/api/profile
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @DeleteMapping
    public ResponseEntity<?> deleteAccount(){
        userProfileService.deleteAccount(getEmail());
        return ResponseEntity.ok(new ApiResponse("Account deleted successfully"));
    }




}
