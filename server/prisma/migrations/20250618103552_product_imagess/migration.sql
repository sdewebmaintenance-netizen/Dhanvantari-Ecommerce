-- DropForeignKey
ALTER TABLE `ProductImage` DROP FOREIGN KEY `ProductImage_product_id_fkey`;

-- DropIndex
DROP INDEX `ProductImage_product_id_fkey` ON `ProductImage`;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
