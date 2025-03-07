/*
  Warnings:

  - Added the required column `book_id` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `page` ADD COLUMN `book_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Book` (
    `book_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'Untitled Book',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`book_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Page` ADD CONSTRAINT `Page_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `Book`(`book_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
