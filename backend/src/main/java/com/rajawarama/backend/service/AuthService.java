package com.rajawarama.backend.service;

import com.rajawarama.backend.dto.AuthResponse;
import com.rajawarama.backend.dto.LoginRequest;
import com.rajawarama.backend.dto.SignUpRequest;
import com.rajawarama.backend.entity.User;
import com.rajawarama.backend.enums.Role;
import com.rajawarama.backend.repository.UserRepository;
import com.rajawarama.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndIsDeletedFalse(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password!");
        }

        user.updateLastLogin();
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getUserId().toString());

        return new AuthResponse(token, user.getUserId(), user.getEmail(), user.getRole().name(), user.getFullName());
    }


}
