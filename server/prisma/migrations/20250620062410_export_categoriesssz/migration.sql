-- AlterTable
ALTER TABLE `Product` ADD COLUMN `productType` ENUM('WHOLESALE', 'EXPORT') NULL,
    ADD COLUMN `variant` VARCHAR(191) NULL;
