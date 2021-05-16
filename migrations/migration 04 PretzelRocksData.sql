CREATE TABLE `CuteBot`.`pretzelrocks_data` (
    `id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id`),
    `channel_id` INT NOT NULL, 
    UNIQUE(channel_id), 
    `last_used` DECIMAL NOT NULL, 
    `last_song` VARCHAR(255) NOT NULL, 
    `last_link` VARCHAR(255) NOT NULL
    ) 
    ENGINE = InnoDB;

ALTER TABLE `CuteBot`.`pretzelrocks_data`
    ADD FOREIGN KEY (`channel_id`) 
    REFERENCES `channels` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE;