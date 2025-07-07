/*
  Warnings:

  - You are about to drop the column `discount_id` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_discount_id_fkey`;

-- DropIndex
DROP INDEX `Order_discount_id_fkey` ON `Order`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `discount_id`;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `discount_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_discount_id_fkey` FOREIGN KEY (`discount_id`) REFERENCES `Discount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
