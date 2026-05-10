-- Run this on PostgreSQL to fix the profile_image_url column
-- This ensures the column is TEXT (unlimited length) instead of VARCHAR(255)

ALTER TABLE users ALTER COLUMN profile_image_url TYPE TEXT;

-- If the column doesn't exist or you get errors, try:
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
