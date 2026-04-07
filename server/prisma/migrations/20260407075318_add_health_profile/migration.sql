-- CreateTable
CREATE TABLE `health_profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `medical_history` VARCHAR(1000) NOT NULL DEFAULT '',
    `allergies` VARCHAR(500) NOT NULL DEFAULT '',
    `current_medications` VARCHAR(500) NOT NULL DEFAULT '',
    `previous_medications` VARCHAR(500) NOT NULL DEFAULT '',
    `blood_type` VARCHAR(5) NOT NULL DEFAULT '',
    `emergency_notes` VARCHAR(500) NOT NULL DEFAULT '',
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `health_profile_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
