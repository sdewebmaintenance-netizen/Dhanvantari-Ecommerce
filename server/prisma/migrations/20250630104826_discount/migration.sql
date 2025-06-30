/*
  Warnings:

  - You are about to drop the column `export_category_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ExportCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_export_category_id_fkey`;

-- DropIndex
DROP INDEX `Product_export_category_id_fkey` ON `Product`;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `discount_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `export_category_id`,
    ADD COLUMN `isVisible` BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE `ExportCategory`;

-- CreateTable
CREATE TABLE `Discount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qty` INTEGER NOT NULL,
    `pricetobereduced` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_discount_id_fkey` FOREIGN KEY (`discount_id`) REFERENCES `Discount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
