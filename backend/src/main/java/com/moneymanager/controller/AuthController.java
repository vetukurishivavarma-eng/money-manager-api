package com.moneymanager.controller;

import com.moneymanager.dto.AuthRequest;
import com.moneymanager.dto.AuthResponse;
import com.moneymanager.entity.User;
import com.moneymanager.repository.UserRepository;
import com.moneymanager.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email already exists");
            return ResponseEntity.badRequest().body(error);
        }

        User user = new User(request.getEmail(), request.getName() != null ? request.getName() : request.getEmail(), "EMAIL");
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getName(), user.getAuthProvider(), user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null || user.getPasswordHash() == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid credentials");
            return ResponseEntity.badRequest().body(error);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid credentials");
            return ResponseEntity.badRequest().body(error);
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getName(), user.getAuthProvider(), user.getId()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Long) {
            Long userId = (Long) principal;
            return userRepository.findById(userId)
                    .map(user -> ResponseEntity.ok(new AuthResponse(null, user.getEmail(), user.getName(), user.getAuthProvider(), user.getId())))
                    .orElse(ResponseEntity.notFound().build());
        }
        Map<String, Object> result = new HashMap<>();
        result.put("authenticated", false);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> googleData) {
        String googleId = googleData.get("googleId");
        String email = googleData.get("email");
        String name = googleData.get("name");

        User user = userRepository.findByGoogleId(googleId).orElse(null);
        if (user == null) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        if (user == null) {
            user = new User(email, name, "GOOGLE");
            user.setGoogleId(googleId);
            user = userRepository.save(user);
        } else {
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                user = userRepository.save(user);
            }
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getName(), user.getAuthProvider(), user.getId()));
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth() {
        Map<String, Object> result = new HashMap<>();
        result.put("authenticated", true);
        return ResponseEntity.ok(result);
    }
}