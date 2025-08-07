/*
  Warnings:

  - You are about to alter the column `paymentResult_id` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `PaymentResult` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `PaymentResult` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_paymentResult_id_fkey`;

-- DropIndex
DROP INDEX `Order_paymentResult_id_fkey` ON `Order`;

-- AlterTable
ALTER TABLE `Order` MODIFY `paymentResult_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `PaymentResult` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_paymentResult_id_fkey` FOREIGN KEY (`paymentResult_id`) REFERENCES `PaymentResult`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
