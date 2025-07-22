-- CreateTable
CREATE TABLE `account` (
    `account_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `house_idhouse` INTEGER UNSIGNED NOT NULL,
    `gps_gps_id` INTEGER UNSIGNED NOT NULL,
    `contacts_contact_id` INTEGER UNSIGNED NOT NULL,
    `devices_device_id` INTEGER NOT NULL,

    INDEX `fk_account_contacts1_idx`(`contacts_contact_id`),
    INDEX `fk_account_devices1_idx`(`devices_device_id`),
    INDEX `fk_account_gps1_idx`(`gps_gps_id`),
    INDEX `fk_account_house_idx`(`house_idhouse`),
    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `contact_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `contact_name` VARCHAR(45) NOT NULL,
    `contact_phone_number` INTEGER NOT NULL,
    `relationship_type` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`contact_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devices` (
    `device_id` INTEGER NOT NULL,
    `device_type` VARCHAR(45) NOT NULL,
    `os` VARCHAR(45) NOT NULL,
    `LastLoginTime` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`device_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gps_saved_location` (
    `gps_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `house_#` INTEGER NOT NULL,
    `street_name` VARCHAR(38) NOT NULL,
    `city` VARCHAR(45) NOT NULL,
    `state` VARCHAR(14) NOT NULL,

    PRIMARY KEY (`gps_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `house` (
    `idhouse` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `special_instructions` VARCHAR(300) NOT NULL,
    `entry_info` VARCHAR(300) NOT NULL,
    `house_address` VARCHAR(80) NOT NULL,

    PRIMARY KEY (`idhouse`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medical` (
    `idmedical` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `medical_history` VARCHAR(45) NOT NULL,
    `user_medication_user_medication` INTEGER NOT NULL,
    `user_allergies_allergy_id` INTEGER NOT NULL,
    `account_account_id` INTEGER UNSIGNED NOT NULL,

    INDEX `fk_medical_account1_idx`(`account_account_id`),
    INDEX `fk_medical_user_allergies1_idx`(`user_allergies_allergy_id`),
    INDEX `fk_medical_user_medication1_idx`(`user_medication_user_medication`),
    PRIMARY KEY (`idmedical`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `idUser` INTEGER NOT NULL AUTO_INCREMENT,
    `f_name` VARCHAR(45) NOT NULL,
    `l_name` VARCHAR(45) NOT NULL,
    `phone_num` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_allergies` (
    `allergy_id` INTEGER NOT NULL,
    `Name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`allergy_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_medication` (
    `user_medication` INTEGER NOT NULL,
    `medication_currently` VARCHAR(45) NOT NULL,
    `previous_medication` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`user_medication`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `fk_account_contacts1` FOREIGN KEY (`contacts_contact_id`) REFERENCES `contacts`(`contact_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `fk_account_devices1` FOREIGN KEY (`devices_device_id`) REFERENCES `devices`(`device_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `fk_account_gps1` FOREIGN KEY (`gps_gps_id`) REFERENCES `gps_saved_location`(`gps_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `fk_account_house` FOREIGN KEY (`house_idhouse`) REFERENCES `house`(`idhouse`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `medical` ADD CONSTRAINT `fk_medical_account1` FOREIGN KEY (`account_account_id`) REFERENCES `account`(`account_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `medical` ADD CONSTRAINT `fk_medical_user_allergies1` FOREIGN KEY (`user_allergies_allergy_id`) REFERENCES `user_allergies`(`allergy_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `medical` ADD CONSTRAINT `fk_medical_user_medication1` FOREIGN KEY (`user_medication_user_medication`) REFERENCES `user_medication`(`user_medication`) ON DELETE NO ACTION ON UPDATE NO ACTION;
