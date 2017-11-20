CREATE DATABASE IF NOT EXISTS fb01;

USE fb01;

CREATE TABLE IF NOT EXISTS `fb_person` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_email` varchar(50) NOT NULL,
  `fb_pwd` varchar(200) NOT NULL,
  `fb_name` varchar(100) NOT NULL,
  `fb_city` varchar(50) NOT NULL,
  `fb_country` varchar(4) NOT NULL,
  `fb_photo` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`),
  FULLTEXT (fb_name)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS `fb_security` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_email` varchar(50) NOT NULL,
  `fb_pwd` varchar(200) NOT NULL,
  `fb_question` varchar(20) NOT NULL,
  `fb_response` varchar(50) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS `fb_identity` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_alias` varchar(50) NOT NULL,
  `fb_title` varchar(10) NOT NULL,
  `fb_name_first` varchar(20) NOT NULL,
  `fb_name_middle` varchar(20) NOT NULL,
  `fb_name_last` varchar(20) NOT NULL,
  `fb_gender` varchar(10) NOT NULL,
  `fb_birth_date` date NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS `fb_contact` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_contact_type` varchar(20) NOT NULL,
  `fb_contact_detail` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS `fb_track` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_track_type` varchar(20) NOT NULL,
  `fb_url_type` varchar(20) NOT NULL,
  `fb_title` varchar(100) NOT NULL,
  `fb_track_url` varchar(100) NOT NULL,
  `fb_descr` varchar(300) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS `fb_address` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_house_nr` varchar(20) NOT NULL,
  `fb_street` varchar(100) NOT NULL,
  `fb_city` varchar(20) NOT NULL,
  `fb_postcode` varchar(20) NOT NULL,
  `fb_county` varchar(20) NOT NULL,
  `fb_country` varchar(20) NOT NULL,
  `fb_formatted` varchar(200) NOT NULL,  
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS `fb_photo` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_filename` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS `fb_link` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_relid` int(11) NOT NULL,
  `fb_id1` int(11) NOT NULL,
  `fb_seq` int(3) NOT NULL,
  `fb_id2` int(11) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fb_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`),
  INDEX `link1` (`fb_relid`, `fb_id1`, `fb_id2`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `fb_rel` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_descr` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS `fb_performer` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_name` varchar(100) NOT NULL,
  `fb_type` varchar(20) NOT NULL,
  `fb_status` varchar(50) NOT NULL,
  `fb_photo` varchar(100) NOT NULL,
  `fb_descr` varchar(300) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`),
  FULLTEXT (fb_name)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

ALTER TABLE `fb_performer` AUTO_INCREMENT=1001;

CREATE TABLE IF NOT EXISTS `fb_performerdetail` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_strapline` varchar(100) NOT NULL,
  `fb_descr` varchar(300) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS `fb_weblinks` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_type` varchar(30) NOT NULL,
  `fb_descr` varchar(100) NOT NULL,
  `fb_link` varchar(100) NOT NULL,
  `fb_photo` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS `fb_location` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_type` varchar(30) NOT NULL,
  `fb_county` varchar(30) NOT NULL,
  `fb_town` varchar(30) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS `fb_newsitem` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_date` date NOT NULL,
  `fb_type` varchar(20) NOT NULL,
  `fb_headline` varchar(100) NOT NULL,
  `fb_link` varchar(200) NOT NULL,
  `fb_descr` text NOT NULL,
  `fb_photo` varchar(100) NOT NULL,
  `fb_updater_id` int(11),
  `fb_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `fb_booking` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_date` date NOT NULL,
  `fb_type` varchar(20) NOT NULL,
  `fb_contact_name` varchar(50) NOT NULL,
  `fb_contact_detail` varchar(100) NOT NULL,
  `fb_descr` text NOT NULL,
  `fb_link` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
