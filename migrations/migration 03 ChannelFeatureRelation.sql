CREATE TABLE `CuteBot`.`channel_features` ( `id` INT NOT NULL AUTO_INCREMENT , `channel_id` INT NOT NULL , `feature_id` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;

ALTER TABLE `CuteBot`.`channel_features`
    ADD FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `CuteBot`.`channel_features`
    ADD FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
