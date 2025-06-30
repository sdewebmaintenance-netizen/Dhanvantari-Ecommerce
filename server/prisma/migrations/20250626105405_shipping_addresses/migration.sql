/*
  Warnings:

  - You are about to drop the column `address` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `ShippingAddress` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `ShippingAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Cart` ADD COLUMN `shipping_address_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `ShippingAddress` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `postalCode`,
    ADD COLUMN `addressLine1` VARCHAR(191) NULL,
    ADD COLUMN `addressLine2` VARCHAR(191) NULL,
    ADD COLUMN `contactNumber` VARCHAR(191) NULL,
    ADD COLUMN `deliveryCountry` VARCHAR(191) NULL,
    ADD COLUMN `deliveryDistrict` VARCHAR(191) NULL,
    ADD COLUMN `deliveryPincode` VARCHAR(191) NULL,
    ADD COLUMN `deliveryState` VARCHAR(191) NULL,
    ADD COLUMN `district` VARCHAR(191) NULL,
    ADD COLUMN `gstin` VARCHAR(191) NULL,
    ADD COLUMN `pincode` VARCHAR(191) NULL,
    ADD COLUMN `transportation` VARCHAR(191) NULL,
    ADD COLUMN `vehicleNumber` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_shipping_address_id_fkey` FOREIGN KEY (`shipping_address_id`) REFERENCES `ShippingAddress`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
