/*
  Warnings:

  - You are about to alter the column `updateTime` on the `PaymentResult` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `PaymentResult` MODIFY `updateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
