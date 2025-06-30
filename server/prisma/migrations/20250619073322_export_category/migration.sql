-- AlterTable
ALTER TABLE `Product` ADD COLUMN `export_category_id` INTEGER NULL,
    ADD COLUMN `inco_term_id` INTEGER NULL,
    ADD COLUMN `port_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `IncoTerm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inco_term_name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Port` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `port_name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExportCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` ENUM('INDUSTRIAL', 'RETAIL', 'CONFECTIONERY', 'BEVERAGES', 'GOURMET') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_export_category_id_fkey` FOREIGN KEY (`export_category_id`) REFERENCES `ExportCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_inco_term_id_fkey` FOREIGN KEY (`inco_term_id`) REFERENCES `IncoTerm`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_port_id_fkey` FOREIGN KEY (`port_id`) REFERENCES `Port`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
