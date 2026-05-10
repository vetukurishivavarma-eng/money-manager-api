package com.moneymanager.controller;

import com.moneymanager.entity.User;
import com.moneymanager.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/image")
    public ResponseEntity<?> updateProfileImage(@RequestBody Map<String, String> request) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = null;

        if (principal instanceof Long) {
            userId = (Long) principal;
        } else if (principal instanceof String) {
            try {
                userId = Long.parseLong((String) principal);
            } catch (NumberFormatException e) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid user");
                return ResponseEntity.badRequest().body(error);
            }
        }

        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }

        String imageUrl = request.get("profileImageUrl");
        if (imageUrl == null || imageUrl.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Image URL is required");
            return ResponseEntity.badRequest().body(error);
        }

        // SECURITY: Reject file paths — only accept base64 data URLs
        if (!imageUrl.startsWith("data:image")) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid image format. Only base64 images are accepted.");
            return ResponseEntity.badRequest().body(error);
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.notFound().build();
        }

        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("profileImageUrl", imageUrl);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/name")
    public ResponseEntity<?> updateName(@RequestBody Map<String, String> request) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = null;

        if (principal instanceof Long) {
            userId = (Long) principal;
        } else if (principal instanceof String) {
            try {
                userId = Long.parseLong((String) principal);
            } catch (NumberFormatException e) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid user");
                return ResponseEntity.badRequest().body(error);
            }
        }

        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized");
            return ResponseEntity.status(401).body(error);
        }

        String name = request.get("name");
        if (name == null || name.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Name is required");
            return ResponseEntity.badRequest().body(error);
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.notFound().build();
        }

        user.setName(name.trim());
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("name", name.trim());
        return ResponseEntity.ok(response);
    }
}