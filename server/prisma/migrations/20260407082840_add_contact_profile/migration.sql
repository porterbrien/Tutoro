-- CreateTable
CREATE TABLE `contact_profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `contact_name` VARCHAR(100) NOT NULL DEFAULT '',
    `relationship_type` VARCHAR(45) NOT NULL DEFAULT '',
    `phone_number` VARCHAR(15) NOT NULL DEFAULT '',
    `email` VARCHAR(100) NOT NULL DEFAULT '',
    `address` VARCHAR(200) NOT NULL DEFAULT '',
    `notes` VARCHAR(500) NOT NULL DEFAULT '',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
