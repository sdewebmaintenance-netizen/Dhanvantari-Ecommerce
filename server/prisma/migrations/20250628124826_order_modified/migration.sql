/*
  Warnings:

  - You are about to drop the column `itemsPrice` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingPrice` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `taxPrice` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Order` DROP COLUMN `itemsPrice`,
    DROP COLUMN `shippingPrice`,
    DROP COLUMN `taxPrice`,
    ADD COLUMN `CGST` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `SGST` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `itemsUnitPrice` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `image`,
    DROP COLUMN `price`;
