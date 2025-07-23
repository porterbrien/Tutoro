/*
  Warnings:

  - You are about to drop the `gps_saved_location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `fk_account_gps1`;

-- DropTable
DROP TABLE `gps_saved_location`;

-- CreateTable
CREATE TABLE `gps` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `latitude` VARCHAR(191) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `fk_account_gps1` FOREIGN KEY (`gps_gps_id`) REFERENCES `gps`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
