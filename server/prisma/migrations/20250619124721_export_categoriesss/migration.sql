/*
  Warnings:

  - You are about to drop the column `state` on the `Port` table. All the data in the column will be lost.
  - Added the required column `district` to the `Port` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Port` DROP COLUMN `state`,
    ADD COLUMN `district` VARCHAR(191) NOT NULL;
