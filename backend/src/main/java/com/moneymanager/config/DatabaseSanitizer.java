package com.moneymanager.config;

import com.moneymanager.entity.User;
import com.moneymanager.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseSanitizer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseSanitizer.class);
    private final UserRepository userRepository;

    public DatabaseSanitizer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        logger.info("Checking for corrupted profile_image_url entries...");
        List<User> users = userRepository.findAll();
        int cleaned = 0;

        for (User user : users) {
            String url = user.getProfileImageUrl();
            if (url != null && (url.startsWith("file://") || url.startsWith("/") || url.contains("/data/user/"))) {
                logger.warn("Cleaning corrupted profile_image_url for user ID {}: {}", user.getId(), url.substring(0, Math.min(80, url.length())));
                user.setProfileImageUrl(null);
                userRepository.save(user);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            logger.info("Database sanitizer: {} corrupted entries cleaned", cleaned);
        } else {
            logger.info("Database sanitizer: no corrupted entries found");
        }
    }
}
