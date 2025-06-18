/*
  Warnings:

  - Made the column `updatedAt` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paidAt` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `PaymentResult` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ShippingAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Category` MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `paidAt` DATETIME(3) NOT NULL,
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `PaymentResult` MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Review` MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `ShippingAddress` MODIFY `updatedAt` DATETIME(3) NOT NULL;
