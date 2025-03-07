/*
  Warnings:

  - You are about to drop the column `education_level` on the `profile` table. All the data in the column will be lost.
  - The values [AGE_6_8] on the enum `Profile_age_range` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `profile` DROP COLUMN `education_level`,
    MODIFY `age_range` ENUM('AGE_2_5', 'AGE_5_10', 'AGE_11_13', 'AGE_14_18', 'AGE_ADULT') NOT NULL;
