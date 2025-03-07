/*
  Warnings:

  - You are about to drop the column `book_id` on the `page` table. All the data in the column will be lost.
  - You are about to drop the `book` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `book_number` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `page` DROP FOREIGN KEY `Page_book_id_fkey`;

-- DropIndex
DROP INDEX `Page_book_id_fkey` ON `page`;

-- AlterTable
ALTER TABLE `page` DROP COLUMN `book_id`,
    ADD COLUMN `book_number` INTEGER NOT NULL;

-- DropTable
DROP TABLE `book`;
