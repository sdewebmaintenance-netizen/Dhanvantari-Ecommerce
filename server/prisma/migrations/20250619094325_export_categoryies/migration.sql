/*
  Warnings:

  - You are about to drop the column `port_name` on the `Port` table. All the data in the column will be lost.
  - Added the required column `country` to the `Port` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Port` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Port` DROP COLUMN `port_name`,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL;
