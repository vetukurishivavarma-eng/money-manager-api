-- Force-convert the column to TEXT first, then clear corrupted data
-- This bypasses Hibernate's type checking which crashes on the corrupted VARCHAR

-- Step 1: Drop the problematic column
ALTER TABLE users DROP COLUMN IF EXISTS profile_image_url;

-- Step 2: Add it back as TEXT (no size limit, handles any string length)
ALTER TABLE users ADD COLUMN profile_image_url TEXT;

-- Step 3: Clear any existing corrupted file paths that may have slipped in
UPDATE users SET profile_image_url = NULL WHERE profile_image_url LIKE 'file://%';
UPDATE users SET profile_image_url = NULL WHERE profile_image_url LIKE '/%';
