-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `mfa_enabled` BOOLEAN NOT NULL DEFAULT false,
    `subscription_status` ENUM('ACTIVE', 'EXPIRED', 'CANCELED', 'TRIAL') NOT NULL DEFAULT 'TRIAL',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailVerification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `verificationCode` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `EmailVerification_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `token_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `access_token` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NOT NULL,
    `device_token` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    UNIQUE INDEX `Token_access_token_key`(`access_token`),
    UNIQUE INDEX `Token_refresh_token_key`(`refresh_token`),
    PRIMARY KEY (`token_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `profile_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `age_range` ENUM(
        'AGE_2_5',
        'AGE_5_10',
        'AGE_6_8',
        'AGE_11_13',
        'AGE_14_18',
        'AGE_ADULT'
    ) NOT NULL,
    `avatar_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `grades` ENUM(
        'PRE_SCHOOL',
        'KINDERGARTEN',
        'FIRST_GRADE',
        'SECOND_GRADE',
        'THIRD_GRADE',
        'FOURTH_GRADE',
        'FIFTH_GRADE',
        'SIXTH_GRADE',
        'SEVENTH_GRADE',
        'EIGHTH_GRADE',
        'NINTH_GRADE',
        'TENTH_GRADE',
        'ELEVENTH_GRADE',
        'TWELFTH_GRADE'
    ) PRIMARY KEY (`profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReadingSession` (
    `session_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `start_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_time` DATETIME(3) NULL,
    `total_reading_time` INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TextRecognition` (
    `recognition_id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NOT NULL,
    `recognized_text` VARCHAR(191) NOT NULL,
    `is_readable` BOOLEAN NOT NULL,
    `captured_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`recognition_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PronunciationFeedback` (
    `feedback_id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NOT NULL,
    `word` VARCHAR(191) NOT NULL,
    `is_correct` BOOLEAN NOT NULL,
    `suggested_pronunciation` VARCHAR(191) NULL,
    `feedback_details` VARCHAR(191) NULL,
    `feedback_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`feedback_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `report_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `week_start_date` DATETIME(3) NOT NULL,
    `week_end_date` DATETIME(3) NOT NULL,
    `total_reading_time` INTEGER NOT NULL DEFAULT 0,
    `mispronounced_words_count` INTEGER NOT NULL DEFAULT 0,
    `ai_help_count` INTEGER NOT NULL DEFAULT 0,
    `generated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`report_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AppSettings` (
    `settings_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `real_time_assistance_enabled` BOOLEAN NOT NULL DEFAULT false,
    `feedback_level` ENUM('SENTENCE', 'PAGE', 'NONE') NOT NULL DEFAULT 'SENTENCE',
    `theme_preference` ENUM('LIGHT', 'DARK') NOT NULL DEFAULT 'LIGHT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    UNIQUE INDEX `AppSettings_profile_id_key`(`profile_id`),
    PRIMARY KEY (`settings_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `subscription_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `plan_type` ENUM('MONTHLY', 'ONE_TIME', 'TRIAL') NOT NULL DEFAULT 'TRIAL',
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `status` ENUM('ACTIVE', 'EXPIRED', 'CANCELED', 'TRIAL') NOT NULL DEFAULT 'ACTIVE',
    UNIQUE INDEX `Subscription_user_id_key`(`user_id`),
    PRIMARY KEY (`subscription_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE
    `Token`
ADD
    CONSTRAINT `Token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Profile`
ADD
    CONSTRAINT `Profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `ReadingSession`
ADD
    CONSTRAINT `ReadingSession_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `TextRecognition`
ADD
    CONSTRAINT `TextRecognition_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `ReadingSession`(`session_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `PronunciationFeedback`
ADD
    CONSTRAINT `PronunciationFeedback_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `ReadingSession`(`session_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Report`
ADD
    CONSTRAINT `Report_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `AppSettings`
ADD
    CONSTRAINT `AppSettings_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Subscription`
ADD
    CONSTRAINT `Subscription_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;