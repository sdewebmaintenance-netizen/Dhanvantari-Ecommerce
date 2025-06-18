/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `image_name` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProductImage` DROP FOREIGN KEY `ProductImage_productId_fkey`;

-- DropIndex
DROP INDEX `ProductImage_productId_fkey` ON `ProductImage`;

-- AlterTable
ALTER TABLE `ProductImage` DROP COLUMN `imageUrl`,
    DROP COLUMN `productId`,
    ADD COLUMN `image_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `product_id` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
