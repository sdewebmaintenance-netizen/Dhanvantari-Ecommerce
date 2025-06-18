/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `LoginHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `loginMethod` ENUM('GOOGLE', 'PHONE') NOT NULL,
    `loginTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);

-- AddForeignKey
ALTER TABLE `LoginHistory` ADD CONSTRAINT `LoginHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
