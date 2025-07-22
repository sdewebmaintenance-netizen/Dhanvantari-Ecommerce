/*
  Warnings:

  - You are about to drop the column `image_name` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProductImage` DROP COLUMN `image_name`,
    ADD COLUMN `image_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `public_id` VARCHAR(191) NOT NULL;
