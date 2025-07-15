-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_shipping_address_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_discount_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_inco_term_id_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_port_id_fkey`;

-- DropIndex
DROP INDEX `Cart_product_id_fkey` ON `Cart`;

-- DropIndex
DROP INDEX `Cart_shipping_address_id_fkey` ON `Cart`;

-- DropIndex
DROP INDEX `Product_discount_id_fkey` ON `Product`;

-- DropIndex
DROP INDEX `Product_inco_term_id_fkey` ON `Product`;

-- DropIndex
DROP INDEX `Product_port_id_fkey` ON `Product`;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_inco_term_id_fkey` FOREIGN KEY (`inco_term_id`) REFERENCES `IncoTerm`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_discount_id_fkey` FOREIGN KEY (`discount_id`) REFERENCES `Discount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_port_id_fkey` FOREIGN KEY (`port_id`) REFERENCES `Port`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_shipping_address_id_fkey` FOREIGN KEY (`shipping_address_id`) REFERENCES `ShippingAddress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
