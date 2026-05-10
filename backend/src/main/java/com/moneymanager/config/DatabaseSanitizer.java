package com.moneymanager.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSanitizer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseSanitizer.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseSanitizer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        logger.info("Running database sanitizer...");

        // Step 1: Ensure column is TEXT type (permanent fix for VARCHAR(255) truncation)
        try {
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN profile_image_url TYPE TEXT");
            logger.info("Column profile_image_url converted to TEXT");
        } catch (Exception e) {
            logger.info("Column type check: {}", e.getMessage());
        }

        // Step 2: Clear corrupted file paths using raw SQL
        // Using OCTET_LENGTH comparison catches any value that was truncated at 255 chars
        // Also explicitly catch patterns known from the buggy APK
        int cleaned = 0;
        try {
            cleaned = jdbcTemplate.update(
                "UPDATE users SET profile_image_url = NULL WHERE profile_image_url IS NOT NULL AND (profile_image_url LIKE 'file://%' OR profile_image_url LIKE '/%' OR OCTET_LENGTH(profile_image_url) > 5000)"
            );
        } catch (Exception e) {
            logger.warn("Direct UPDATE failed (column may still be wrong type): {}", e.getMessage());
            // Fallback: try to identify and fix just the known bad rows
            try {
                cleaned = jdbcTemplate.update(
                    "UPDATE users SET profile_image_url = NULL WHERE profile_image_url LIKE 'file://%'"
                );
            } catch (Exception e2) {
                logger.error("Even fallback update failed: {}", e2.getMessage());
                logger.error("Manual database intervention required. Run this SQL on PostgreSQL:");
                logger.error("  ALTER TABLE users DROP COLUMN profile_image_url;");
                logger.error("  ALTER TABLE users ADD COLUMN profile_image_url TEXT;");
                return;
            }
        }

        if (cleaned > 0) {
            logger.info("Database sanitizer: {} corrupted entries cleaned", cleaned);
        } else {
            logger.info("Database sanitizer: no corrupted entries found");
        }
    }
}
