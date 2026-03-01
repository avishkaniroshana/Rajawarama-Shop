package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.AuthResponse;
import com.rajawarama.backend.dto.LoginRequest;
import com.rajawarama.backend.dto.SignUpRequest;
import com.rajawarama.backend.entity.RefreshToken;
import com.rajawarama.backend.entity.User;
import com.rajawarama.backend.enums.Role;
import com.rajawarama.backend.exception.AuthenticationException;
import com.rajawarama.backend.repository.RefreshTokenRepository;
import com.rajawarama.backend.repository.UserRepository;
import com.rajawarama.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;


    public void register(SignUpRequest request) {

        userRepository.findByEmail(request.getEmail())
                .ifPresentOrElse(user -> {

                    // Email exists & account is ACTIVE
                    if (!user.isDeleted()) {
                        throw new RuntimeException("Email already registered!");
                    }

                    // Email exists & account is DELETED → Reactivate
                    user.setDeleted(false);
                    user.setFullName(request.getFullName());
                    user.setPhone(request.getPhone());
                    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
                    user.setRole(Role.CUSTOMER); // safety reset

                    userRepository.save(user);

                }, () -> {

                    // Email does NOT exist → Create new account
                    User newUser = new User(
                            request.getEmail(),
                            request.getFullName(),
                            passwordEncoder.encode(request.getPassword()),
                            request.getPhone(),
                            Role.CUSTOMER
                    );

                    userRepository.save(newUser);
                });
    }


    @Transactional
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmailAndIsDeletedFalse(request.getEmail())
                .orElseThrow(() ->
                        new AuthenticationException("Invalid email or password!")
                );

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthenticationException("Invalid email or password!");
        }

        user.updateLastLogin();
        userRepository.save(user);

        // Generate Access Token
        String accessToken = jwtUtil.generateAccessToken(
                user.getEmail(),
                user.getRole().name(),
                user.getUserId().toString()
        );

        // Generate Refresh Token
        String refreshTokenValue = jwtUtil.generateRefreshToken(user.getEmail());

        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(null);

        if (refreshToken != null) {
            refreshToken.setToken(refreshTokenValue);
            refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
        } else {
            refreshToken = new RefreshToken(
                    user,
                    refreshTokenValue,
                    LocalDateTime.now().plusDays(7)
            );
        }

        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(
                accessToken,
                refreshTokenValue,
                user.getUserId(),
                user.getEmail(),
                user.getRole().name(),
                user.getFullName()
        );
    }

    public AuthResponse refreshToken(String refreshTokenValue) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException("Refresh token expired");
        }

        User user = refreshToken.getUser();

        String newAccessToken = jwtUtil.generateAccessToken(
                user.getEmail(),
                user.getRole().name(),
                user.getUserId().toString()
        );

        return new AuthResponse(
                newAccessToken,
                refreshTokenValue,
                user.getUserId(),
                user.getEmail(),
                user.getRole().name(),
                user.getFullName()
        );
    }

    // ================= LOGOUT =================
    public void logout(String refreshTokenValue) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        refreshTokenRepository.delete(refreshToken);
    }

}
