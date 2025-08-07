/*
  Warnings:

  - The primary key for the `PaymentResult` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_paymentResult_id_fkey`;

-- DropIndex
DROP INDEX `Order_paymentResult_id_fkey` ON `Order`;

-- AlterTable
ALTER TABLE `Order` MODIFY `paymentResult_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `PaymentResult` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_paymentResult_id_fkey` FOREIGN KEY (`paymentResult_id`) REFERENCES `PaymentResult`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
