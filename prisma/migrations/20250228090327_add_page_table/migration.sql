-- AlterTable
ALTER TABLE `profile` ADD COLUMN `readingLevel` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Page` (
    `page_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`page_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
