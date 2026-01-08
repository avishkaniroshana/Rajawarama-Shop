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

    public void register(SignUpRequest request){
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getEmail(),
                request.getFullName(),
                hashedPassword,
                request.getPhone(),
                Role.CUSTOMER
        );
        userRepository.save(user);

    }

    public AuthResponse login(LoginRequest request){
        User user = userRepository.findByEmailAndIsDeletedFalse(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password!"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())){
            throw new RuntimeException("Invalid email or password!");
        }

        user.updateLastLogin();
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }


}
