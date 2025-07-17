-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_shipping_address_id_fkey`;

-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_user_id_fkey`;

-- DropIndex
DROP INDEX `Cart_product_id_fkey` ON `Cart`;

-- DropIndex
DROP INDEX `Cart_shipping_address_id_fkey` ON `Cart`;

-- DropIndex
DROP INDEX `Cart_user_id_fkey` ON `Cart`;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_shipping_address_id_fkey` FOREIGN KEY (`shipping_address_id`) REFERENCES `ShippingAddress`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
