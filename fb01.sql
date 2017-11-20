-- phpMyAdmin SQL Dump
-- version 4.0.10.18
-- https://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Jul 05, 2017 at 12:25 PM
-- Server version: 5.6.35-cll-lve
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `fb01`
--

-- --------------------------------------------------------

--
-- Table structure for table `fb_address`
--

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1001 ;

--
-- Dumping data for table `fb_address`
--

INSERT INTO `fb_address` (`fb_id`, `fb_house_nr`, `fb_street`, `fb_city`, `fb_postcode`, `fb_county`, `fb_country`, `fb_formatted`, `fb_created`) VALUES
(1000, '8', 'Empress Avenue', 'Farnborough', 'GU14 8LX', 'Hampshire', 'United Kingdom', '8 Empress Avenue\nFarnborough\nHampshire\nGU14 8LX\nUnited Kingdom', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `fb_contact`
--

CREATE TABLE IF NOT EXISTS `fb_contact` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_contact_type` varchar(20) NOT NULL,
  `fb_contact_detail` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1001 ;

--
-- Dumping data for table `fb_contact`
--

INSERT INTO `fb_contact` (`fb_id`, `fb_contact_type`, `fb_contact_detail`, `fb_created`) VALUES
(1000, 'Mobile phone', '07879648143', '2017-06-29 20:53:28');

-- --------------------------------------------------------

--
-- Table structure for table `fb_events`
--

CREATE TABLE IF NOT EXISTS `fb_events` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_type` varchar(30) NOT NULL,
  `fb_descr` varchar(100) NOT NULL,
  `fb_location` varchar(100) NOT NULL,
  `fb_photo` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `fb_identity`
--

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1008 ;

--
-- Dumping data for table `fb_identity`
--

INSERT INTO `fb_identity` (`fb_id`, `fb_alias`, `fb_title`, `fb_name_first`, `fb_name_middle`, `fb_name_last`, `fb_gender`, `fb_birth_date`, `fb_created`) VALUES
(1000, 'Lyndon', 'Mr', 'Lyndon', '', 'Sutcliffe', 'Male', '0000-00-00', '0000-00-00 00:00:00'),
(1002, 'Michael', 'Mr', 'Michael', '', 'Cochrane', '', '0000-00-00', '0000-00-00 00:00:00'),
(1003, '', 'Mrs', 'Tricia', '', 'Rimmage', 'Female', '0000-00-00', '0000-00-00 00:00:00'),
(1004, 'Andy', '', 'Andrew', '', 'Hiles', 'Male', '0000-00-00', '0000-00-00 00:00:00'),
(1005, 'Lucy', '', 'Lucy', '', 'Paruit', 'Female', '0000-00-00', '0000-00-00 00:00:00'),
(1006, 'Cammy', '', 'Cameron', '', 'Phare', '', '0000-00-00', '0000-00-00 00:00:00'),
(1007, '', '', 'Jim', '', 'Cozens', '', '0000-00-00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `fb_link`
--

CREATE TABLE IF NOT EXISTS `fb_link` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_relid` int(11) NOT NULL,
  `fb_id1` int(11) NOT NULL,
  `fb_seq` int(3) NOT NULL,
  `fb_id2` int(11) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`),
  KEY `link1` (`fb_relid`,`fb_id1`,`fb_id2`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=101 ;

--
-- Dumping data for table `fb_link`
--

INSERT INTO `fb_link` (`fb_id`, `fb_relid`, `fb_id1`, `fb_seq`, `fb_id2`, `fb_created`) VALUES
(1, 41, 1000, 0, 1000, '2017-06-29 11:02:41'),
(2, 21, 1000, 0, 1000, '2017-06-29 11:03:47'),
(3, 11, 1000, 0, 1000, '2017-06-29 11:05:21'),
(4, 31, 1000, 0, 1000, '2017-06-29 20:53:28'),
(14, 51, 1000, 0, 1, '2017-06-30 14:19:44'),
(15, 51, 1000, 0, 2, '2017-06-30 14:20:18'),
(16, 51, 1000, 0, 3, '2017-06-30 14:21:03'),
(17, 51, 1000, 0, 1001, '2017-06-30 14:41:50'),
(25, 61, 1001, 0, 1016, '2017-06-30 14:45:47'),
(26, 71, 1001, 0, 1000, '2017-06-30 14:47:38'),
(28, 51, 1000, 0, 1002, '2017-06-30 15:15:31'),
(29, 71, 1002, 0, 1001, '2017-06-30 15:21:13'),
(31, 91, 1002, 0, 1, '2017-06-30 15:28:12'),
(32, 91, 1002, 0, 2, '2017-06-30 15:37:13'),
(34, 81, 1002, 0, 2, '2017-06-30 15:46:47'),
(35, 81, 1002, 0, 3, '2017-06-30 15:46:47'),
(41, 61, 1002, 0, 1024, '2017-06-30 19:50:13'),
(42, 1, 1000, 0, 1025, '2017-07-01 10:07:33'),
(43, 41, 1001, 0, 1001, '2017-07-04 18:12:59'),
(45, 21, 1001, 0, 1002, '2017-07-04 18:16:48'),
(46, 1, 1001, 0, 1026, '2017-07-04 18:18:04'),
(47, 51, 1001, 0, 1003, '2017-07-04 18:19:04'),
(48, 51, 1001, 0, 1004, '2017-07-04 18:19:04'),
(49, 61, 1003, 0, 1027, '2017-07-04 18:21:20'),
(50, 71, 1003, 0, 1002, '2017-07-04 18:25:05'),
(52, 91, 1003, 0, 3, '2017-07-04 18:30:25'),
(54, 91, 1003, 0, 5, '2017-07-04 18:41:47'),
(55, 41, 1002, 0, 1002, '2017-07-04 18:46:00'),
(56, 21, 1002, 0, 1003, '2017-07-04 18:48:11'),
(57, 1, 1002, 0, 1028, '2017-07-04 18:50:17'),
(58, 51, 1002, 0, 1005, '2017-07-04 18:50:54'),
(59, 61, 1005, 0, 1029, '2017-07-04 18:53:04'),
(60, 71, 1005, 0, 1003, '2017-07-04 18:54:41'),
(62, 91, 1005, 0, 6, '2017-07-04 18:59:13'),
(63, 41, 1003, 0, 1003, '2017-07-04 19:02:31'),
(64, 21, 1003, 0, 1004, '2017-07-04 19:03:11'),
(65, 51, 1003, 0, 1006, '2017-07-04 19:03:46'),
(66, 61, 1006, 0, 1030, '2017-07-04 19:04:19'),
(67, 71, 1006, 0, 1004, '2017-07-04 19:05:12'),
(69, 91, 1006, 0, 7, '2017-07-04 19:11:12'),
(70, 91, 1006, 0, 8, '2017-07-04 19:13:17'),
(71, 41, 1004, 0, 1004, '2017-07-04 19:17:45'),
(72, 21, 1004, 0, 1005, '2017-07-04 19:21:04'),
(73, 51, 1004, 0, 1007, '2017-07-04 19:21:31'),
(74, 61, 1007, 0, 1031, '2017-07-04 19:23:43'),
(75, 71, 1007, 0, 1005, '2017-07-04 19:24:39'),
(77, 41, 1005, 0, 1005, '2017-07-04 19:40:11'),
(78, 21, 1005, 0, 1006, '2017-07-04 19:40:41'),
(79, 51, 1005, 0, 1008, '2017-07-04 19:41:53'),
(80, 61, 1008, 0, 1032, '2017-07-04 19:45:01'),
(81, 91, 1008, 0, 9, '2017-07-04 19:50:18'),
(82, 91, 1007, 0, 10, '2017-07-04 19:54:38'),
(83, 41, 1006, 0, 1006, '2017-07-04 19:58:58'),
(84, 21, 1006, 0, 1007, '2017-07-04 19:59:24'),
(85, 51, 1006, 0, 1009, '2017-07-04 19:59:47'),
(86, 61, 1009, 0, 1033, '2017-07-04 20:00:02'),
(87, 71, 1009, 0, 1006, '2017-07-04 20:00:39'),
(88, 91, 1009, 0, 11, '2017-07-04 20:02:56'),
(91, 81, 1003, 0, 10, '2017-07-05 10:25:04'),
(94, 81, 1005, 0, 13, '2017-07-05 10:28:21'),
(97, 81, 1006, 0, 16, '2017-07-05 10:39:48'),
(100, 81, 1007, 0, 19, '2017-07-05 10:45:51');

-- --------------------------------------------------------

--
-- Table structure for table `fb_newsfeed`
--

CREATE TABLE IF NOT EXISTS `fb_newsfeed` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_news_dt` varchar(8) NOT NULL,
  `fb_performer_id` int(11) NOT NULL,
  `fb_media_id` int(11) NOT NULL,
  `fb_added_dt` varchar(30) NOT NULL,
  `fb_news_event` varchar(20) NOT NULL,
  `fb_title` varchar(100) NOT NULL,
  `fb_type` varchar(20) NOT NULL,
  `fb_track_type` varchar(20) NOT NULL,
  `fb_track_url` varchar(100) NOT NULL,
  `fb_url_type` varchar(20) NOT NULL,
  `fb_track_count` int(11) NOT NULL,
  `fb_link_count` int(11) NOT NULL,
  `fb_photo` varchar(100) NOT NULL,
  `fb_name` varchar(100) NOT NULL,
  `fb_strapline` varchar(100) NOT NULL,
  `fb_descr` varchar(300) NOT NULL,
  `fb_link` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=29 ;

--
-- Dumping data for table `fb_newsfeed`
--

INSERT INTO `fb_newsfeed` (`fb_id`, `fb_news_dt`, `fb_performer_id`, `fb_media_id`, `fb_added_dt`, `fb_news_event`, `fb_title`, `fb_type`, `fb_track_type`, `fb_track_url`, `fb_url_type`, `fb_track_count`, `fb_link_count`, `fb_photo`, `fb_name`, `fb_strapline`, `fb_descr`, `fb_link`, `fb_created`) VALUES
(1, '20170704', 1009, 0, '04 Jul 2017', 'Performer', '', 'Solo Performer', '', '', '', 1, 0, 'photos/prf100920170704090002.jpg', 'Jim Cozens', 'The one and only', 'Popular singer sownwriter', '', '2017-07-05 13:26:14'),
(2, '20170704', 1008, 0, '04 Jul 2017', 'Performer', '', 'Solo Performer', '', '', '', 1, 0, 'photos/prf100820170704084501.jpg', 'Venus as a boy', ' ', ' ', '', '2017-07-05 13:26:14'),
(3, '20170704', 1007, 0, '04 Jul 2017', 'Performer', '', 'Band / Group', '', '', '', 1, 1, 'photos/prf100720170704082343.jpg', 'Bahama House', 'by popular demand', 'popular covers combo with a wide range of material', '', '2017-07-05 13:26:14'),
(4, '20170704', 1006, 0, '04 Jul 2017', 'Performer', '', 'Solo Performer', '', '', '', 2, 1, 'photos/prf100620170704080419.jpg', 'Andy Hiles', 'the great grandaddy of blues', 'singer song writer and guitar player', '', '2017-07-05 13:26:14'),
(5, '20170704', 1005, 0, '04 Jul 2017', 'Performer', '', 'Band / Group', '', '', '', 1, 1, 'photos/prf100520170704075304.jpg', '2tanium', 'popular cover duo', 'large repertoire of songs from all eras', '', '2017-07-05 13:26:14'),
(6, '20170704', 1003, 0, '04 Jul 2017', 'Performer', '', 'Solo Performer', '', '', '', 2, 1, 'photos/prf100320170704072120.jpg', 'Michael Cochrane', 'Talented singer songwriter from Belfast', 'Singer-songwriter at Singer-songwriter\nStudied at Belfast Metropolitan College\nLives in Edinburgh, United Kingdom\nFrom Belfast, United Kingdom', '', '2017-07-05 13:26:14'),
(7, '20170630', 1002, 0, '30 Jun 2017', 'Performer', '', 'Solo Performer', '', '', '', 2, 2, 'photos/prf100220170630085013.jpg', 'Lyndon', 'the one and only', 'Singer songwriter guitar player. with a wide range of original material', '', '2017-07-05 13:26:14'),
(8, '20170704', 1009, 0, '04 Jul 2017', 'Track', 'Jim Cozens band', '', 'Original', 'audio/trk100920170704090255.mp3', 'Upload', 0, 0, 'photos/prf100920170704090002.jpg', 'Jim Cozens', '', '', '', '2017-07-05 13:26:14'),
(9, '20170704', 1007, 0, '04 Jul 2017', 'Track', 'ring of fire', '', 'Cover', 'audio/trk100720170704085435.mp3', 'Upload', 0, 0, 'photos/prf100720170704082343.jpg', 'Bahama House', '', '', '', '2017-07-05 13:26:14'),
(10, '20170704', 1008, 0, '04 Jul 2017', 'Track', 'Auld Reekie', '', 'Original', 'audio/trk100820170704085018.mp3', 'Upload', 0, 0, 'photos/prf100820170704084501.jpg', 'Venus as a boy', '', '', '', '2017-07-05 13:26:14'),
(11, '20170704', 1006, 0, '04 Jul 2017', 'Track', 'Secret of Fire', '', 'Original', 'audio/trk100620170704081309.mp3', 'Upload', 0, 0, 'photos/prf100620170704080419.jpg', 'Andy Hiles', '', '', '', '2017-07-05 13:26:14'),
(12, '20170704', 1006, 0, '04 Jul 2017', 'Track', 'Johnny Parlez', '', 'Original', 'audio/trk100620170704081112.mp3', 'Upload', 0, 0, 'photos/prf100620170704080419.jpg', 'Andy Hiles', '', '', '', '2017-07-05 13:26:14'),
(13, '20170704', 1005, 0, '04 Jul 2017', 'Track', 'Mama Mia', '', 'Cover', 'audio/trk100520170704075907.mp3', 'Upload', 0, 0, 'photos/prf100520170704075304.jpg', '2tanium', '', '', '', '2017-07-05 13:26:14'),
(14, '20170704', 1003, 0, '04 Jul 2017', 'Track', 'Pack up and fly away', '', 'Original', 'audio/trk100320170704074146.mp3', 'Upload', 0, 0, 'photos/prf100320170704072120.jpg', 'Michael Cochrane', '', '', '', '2017-07-05 13:26:14'),
(15, '20170704', 1003, 0, '04 Jul 2017', 'Track', 'Lucia Sunshine', '', 'Original', 'audio/trk100320170704073019.mp3', 'Upload', 0, 0, 'photos/prf100320170704072120.jpg', 'Michael Cochrane', '', '', '', '2017-07-05 13:26:14'),
(16, '20170630', 1002, 0, '30 Jun 2017', 'Track', 'Sensation', '', 'Original', 'http://feeds.soundcloud.com/stream/281220384-lyndonsutcliffe-rock-and-roll-queen.mp3', 'External', 0, 0, 'photos/prf100220170630085013.jpg', 'Lyndon', '', '', '', '2017-07-05 13:26:14'),
(17, '20170630', 1002, 0, '30 Jun 2017', 'Track', 'Shoulder to cry on', '', 'Original', 'http://feeds.soundcloud.com/stream/255622150-lyndonsutcliffe-shoulder-to-cry-on-1.mp3', 'External', 0, 0, 'photos/prf100220170630085013.jpg', 'Lyndon', '', '', '', '2017-07-05 13:26:14'),
(23, '20170704', 1007, 19, '05 Jul 2017', 'Media', '', 'Video Stream', '', '', '', 0, 0, 'photos/prf100720170704082343.jpg', 'Bahama House', '', 'Free Fallin - live cover', 'https://www.facebook.com/bahamahouseduo/videos/649498445259405/', '2017-07-05 13:26:14'),
(24, '20170704', 1006, 16, '05 Jul 2017', 'Media', '', 'Video Stream', '', '', '', 0, 0, 'photos/prf100620170704080419.jpg', 'Andy Hiles', '', 'The Hare On The Hill live', 'https://www.facebook.com/Fretworxmusic/videos/1152045651607769/', '2017-07-05 13:26:14'),
(25, '20170704', 1005, 13, '05 Jul 2017', 'Media', '', 'Video Stream', '', '', '', 0, 0, 'photos/prf100520170704075304.jpg', '2tanium', '', 'Mr Blue Sky', 'https://www.youtube.com/watch?v=cr0GZ27KCZ4', '2017-07-05 13:26:14'),
(26, '20170704', 1003, 10, '05 Jul 2017', 'Media', '', 'Video Stream', '', '', '', 0, 0, 'photos/prf100320170704072120.jpg', 'Michael Cochrane', '', 'Wish you were here - classic pink floyd cover', 'https://www.youtube.com/watch?v=iYbrsS4G0pg&feature=youtu.be', '2017-07-05 13:26:14'),
(27, '20170630', 1002, 2, '30 Jun 2017', 'Media', '', 'Video Stream', '', '', '', 0, 0, 'photos/tnl100220170630044441.jpg', 'Lyndon', '', 'Cafe du Mistral - youtube video', 'https://www.youtube.com/watch?v=gW0M-iB8TNo', '2017-07-05 13:26:14'),
(28, '20170630', 1002, 3, '30 Jun 2017', 'Media', '', 'Video Stream', '', '', '', 0, 0, 'photos/tnl100220170630044643.jpg', 'Lyndon', '', 'The story of the beat - live', 'https://www.youtube.com/watch?v=md4cRWdyM_8', '2017-07-05 13:26:14');

-- --------------------------------------------------------

--
-- Table structure for table `fb_newsFeed`
--

CREATE TABLE IF NOT EXISTS `fb_newsFeed` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_news_dt` varchar(8) NOT NULL,
  `fb_performer_id` int(11) NOT NULL,
  `fb_media_id` int(11) NOT NULL,
  `fb_added_dt` varchar(30) NOT NULL,
  `fb_news_event` varchar(20) NOT NULL,
  `fb_title` varchar(100) NOT NULL,
  `fb_type` varchar(20) NOT NULL,
  `fb_track_type` varchar(20) NOT NULL,
  `fb_track_url` varchar(100) NOT NULL,
  `fb_url_type` varchar(20) NOT NULL,
  `fb_track_count` int(11) NOT NULL,
  `fb_link_count` int(11) NOT NULL,
  `fb_photo` varchar(100) NOT NULL,
  `fb_name` varchar(100) NOT NULL,
  `fb_strapline` varchar(100) NOT NULL,
  `fb_descr` varchar(300) NOT NULL,
  `fb_link` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `fb_performer`
--

CREATE TABLE IF NOT EXISTS `fb_performer` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_name` varchar(100) NOT NULL,
  `fb_type` varchar(20) NOT NULL,
  `fb_status` varchar(50) NOT NULL,
  `fb_photo` varchar(100) NOT NULL,
  `fb_descr` varchar(300) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`),
  FULLTEXT KEY `fb_name` (`fb_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1010 ;

--
-- Dumping data for table `fb_performer`
--

INSERT INTO `fb_performer` (`fb_id`, `fb_name`, `fb_type`, `fb_status`, `fb_photo`, `fb_descr`, `fb_created`) VALUES
(1002, 'Lyndon', 'Solo Performer', 'Active', 'photos/prf100220170630085013.jpg', '', '2017-06-30 15:15:31'),
(1003, 'Michael Cochrane', 'Solo Performer', 'Active', 'photos/prf100320170704072120.jpg', '', '2017-07-04 18:19:04'),
(1005, '2tanium', 'Band / Group', 'Active', 'photos/prf100520170704075304.jpg', '', '2017-07-04 18:50:54'),
(1006, 'Andy Hiles', 'Solo Performer', 'Active', 'photos/prf100620170704080419.jpg', '', '2017-07-04 19:03:46'),
(1007, 'Bahama House', 'Band / Group', 'Active', 'photos/prf100720170704082343.jpg', '', '2017-07-04 19:21:31'),
(1008, 'Venus as a boy', 'Solo Performer', 'Active', 'photos/prf100820170704084501.jpg', '', '2017-07-04 19:41:53'),
(1009, 'Jim Cozens', 'Solo Performer', 'Active', 'photos/prf100920170704090002.jpg', '', '2017-07-04 19:59:47');

-- --------------------------------------------------------

--
-- Table structure for table `fb_performerdetail`
--

CREATE TABLE IF NOT EXISTS `fb_performerdetail` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_strapline` varchar(100) NOT NULL,
  `fb_descr` varchar(300) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1007 ;

--
-- Dumping data for table `fb_performerdetail`
--

INSERT INTO `fb_performerdetail` (`fb_id`, `fb_strapline`, `fb_descr`, `fb_created`) VALUES
(1001, 'the one and only', 'Singer songwriter guitar player. with a wide range of original material', '2017-06-30 15:21:13'),
(1002, 'Talented singer songwriter from Belfast', 'Singer-songwriter at Singer-songwriter\nStudied at Belfast Metropolitan College\nLives in Edinburgh, United Kingdom\nFrom Belfast, United Kingdom', '2017-07-04 18:25:05'),
(1003, 'popular cover duo', 'large repertoire of songs from all eras', '2017-07-04 18:54:41'),
(1004, 'the great grandaddy of blues', 'singer song writer and guitar player', '2017-07-04 19:05:12'),
(1005, 'by popular demand', 'popular covers combo with a wide range of material', '2017-07-04 19:24:39'),
(1006, 'The one and only', 'Popular singer sownwriter', '2017-07-04 20:00:39');

-- --------------------------------------------------------

--
-- Table structure for table `fb_person`
--

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
  FULLTEXT KEY `fb_name` (`fb_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1007 ;

--
-- Dumping data for table `fb_person`
--

INSERT INTO `fb_person` (`fb_id`, `fb_email`, `fb_pwd`, `fb_name`, `fb_city`, `fb_country`, `fb_photo`, `fb_created`) VALUES
(1000, 'l11vdo@gmail.com', '$2a$10$8329c3ae80d8f0b402f4eeT5dCnkd4lTkTRZjWxiWRAfIAyKvQVLe', 'Lyndon  Sutcliffe', 'Farnborough', '', 'photos/avt100020170701110733.jpg', '2017-06-29 11:02:41'),
(1001, 'l11vdo+01@gmail.com', '$2a$10$8378a8866aa9bbfdd9405ug2YEnnQIOsvDYQw2JxFtRtrSa7KD6Du', 'Michael  Cochrane', '', '', 'photos/avt100120170704071804.jpg', '2017-07-04 18:12:59'),
(1002, 'l11vdo+02@gmail.com', '$2a$10$6e72bc33edaef628db8e1uhZOOcowz1OTM3ad6DSQb.iDi8shexkK', 'Tricia  Rimmage', '', '', 'photos/avt100220170704075017.jpg', '2017-07-04 18:46:00'),
(1003, 'l11vdo+03@gmail.com', '$2a$10$470b3b1ecbdf4d08b3eccuiyk6WHb2cyVLlRx78T.wrUz0s2h9GuC', 'Andrew  Hiles', '', '', 'photos/avt_fanbase.jpg', '2017-07-04 19:02:31'),
(1004, 'l11vdo+04@gmail.com', '$2a$10$1c4b5fcff59a8c923b8ffuRd0tqsu83af4p6zRXVRlveMo75uAshu', 'Lucy  Paruit', '', '', 'photos/avt_fanbase.jpg', '2017-07-04 19:17:45'),
(1005, 'l11vdo+05@gmail.com', '$2a$10$2e019b76af7755c5af2cdO8SI29qyTb2NUxc.n58X17HfFJ1bzX92', 'Cameron  Phare', '', '', 'photos/avt_fanbase.jpg', '2017-07-04 19:40:11'),
(1006, 'l11vdo+06@gmail.com', '$2a$10$851e7d4ad6b5dfb9bf0dbOhHgYSaH6z7Y0t1J3CSfPWbk6pn1ln/q', 'Jim  Cozens', '', '', 'photos/avt_fanbase.jpg', '2017-07-04 19:58:58');

-- --------------------------------------------------------

--
-- Table structure for table `fb_photo`
--

CREATE TABLE IF NOT EXISTS `fb_photo` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_filename` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1034 ;

--
-- Dumping data for table `fb_photo`
--

INSERT INTO `fb_photo` (`fb_id`, `fb_filename`, `fb_created`) VALUES
(1000, 'photos/avt100020170629103059.jpg', '2017-06-29 21:30:59'),
(1001, 'photos/avt100020170629103101.jpg', '2017-06-29 21:31:01'),
(1002, 'photos/avt100020170629103232.jpg', '2017-06-29 21:32:32'),
(1003, 'photos/avt100020170630085518.jpg', '2017-06-30 07:55:18'),
(1004, 'photos/avt100020170630085518.jpg', '2017-06-30 07:55:18'),
(1005, 'photos/avt100020170630085545.jpg', '2017-06-30 07:55:45'),
(1006, 'photos/avt100020170630085621.jpg', '2017-06-30 07:56:21'),
(1007, 'photos/avt100020170630091120.jpg', '2017-06-30 08:11:20'),
(1008, 'photos/avt100020170630031823.jpg', '2017-06-30 14:18:23'),
(1009, 'photos/prf100120170630034517.jpg', '2017-06-30 14:45:17'),
(1010, 'photos/prf100120170630034545.jpg', '2017-06-30 14:45:45'),
(1011, 'photos/prf100120170630034545.jpg', '2017-06-30 14:45:45'),
(1012, 'photos/prf100120170630034546.jpg', '2017-06-30 14:45:46'),
(1013, 'photos/prf100120170630034546.jpg', '2017-06-30 14:45:46'),
(1014, 'photos/prf100120170630034546.jpg', '2017-06-30 14:45:46'),
(1015, 'photos/prf100120170630034546.jpg', '2017-06-30 14:45:46'),
(1016, 'photos/prf100120170630034547.jpg', '2017-06-30 14:45:47'),
(1017, 'photos/avt100020170630040219.jpg', '2017-06-30 15:02:19'),
(1018, 'photos/prf100220170630042242.jpg', '2017-06-30 15:22:42'),
(1019, 'photos/avt100020170630061633.jpg', '2017-06-30 17:16:33'),
(1020, 'photos/avt100020170630062218.jpg', '2017-06-30 17:22:18'),
(1021, 'photos/prf100220170630070339.jpg', '2017-06-30 18:03:39'),
(1022, 'photos/prf100220170630070359.jpg', '2017-06-30 18:03:59'),
(1023, 'photos/prf100220170630070439.jpg', '2017-06-30 18:04:39'),
(1024, 'photos/prf100220170630085013.jpg', '2017-06-30 19:50:13'),
(1025, 'photos/avt100020170701110733.jpg', '2017-07-01 10:07:33'),
(1026, 'photos/avt100120170704071804.jpg', '2017-07-04 18:18:04'),
(1027, 'photos/prf100320170704072120.jpg', '2017-07-04 18:21:20'),
(1028, 'photos/avt100220170704075017.jpg', '2017-07-04 18:50:17'),
(1029, 'photos/prf100520170704075304.jpg', '2017-07-04 18:53:04'),
(1030, 'photos/prf100620170704080419.jpg', '2017-07-04 19:04:19'),
(1031, 'photos/prf100720170704082343.jpg', '2017-07-04 19:23:43'),
(1032, 'photos/prf100820170704084501.jpg', '2017-07-04 19:45:01'),
(1033, 'photos/prf100920170704090002.jpg', '2017-07-04 20:00:02');

-- --------------------------------------------------------

--
-- Table structure for table `fb_radiofeed`
--

CREATE TABLE IF NOT EXISTS `fb_radiofeed` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_title` varchar(100) NOT NULL,
  `fb_track_url` varchar(100) NOT NULL,
  `fb_track_type` varchar(20) NOT NULL,
  `fb_added_dt` varchar(30) NOT NULL,
  `fb_performer_id` varchar(11) NOT NULL,
  `fb_photo` varchar(100) NOT NULL,
  `fb_name` varchar(100) NOT NULL,
  `fb_strapline` varchar(100) NOT NULL,
  `fb_descr` varchar(300) NOT NULL,
  `fb_type` varchar(20) NOT NULL,
  `fb_track_count` int(11) NOT NULL,
  `fb_link_count` int(11) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1010 ;

--
-- Dumping data for table `fb_radiofeed`
--

INSERT INTO `fb_radiofeed` (`fb_id`, `fb_title`, `fb_track_url`, `fb_track_type`, `fb_added_dt`, `fb_performer_id`, `fb_photo`, `fb_name`, `fb_strapline`, `fb_descr`, `fb_type`, `fb_track_count`, `fb_link_count`, `fb_created`) VALUES
(1000, 'Jim Cozens band', 'audio/trk100920170704090255.mp3', 'Original', '04 Jul 2017', '1009', 'photos/prf100920170704090002.jpg', 'Jim Cozens', 'The one and only', 'Popular singer sownwriter', 'Solo Performer', 1, 0, '2017-07-04 21:32:34'),
(1001, 'ring of fire', 'audio/trk100720170704085435.mp3', 'Cover', '04 Jul 2017', '1007', 'photos/prf100720170704082343.jpg', 'Bahama House', 'by popular demand', 'popular covers combo with a wide range of material', 'Band / Group', 1, 1, '2017-07-04 21:32:34'),
(1002, 'Auld Reekie', 'audio/trk100820170704085018.mp3', 'Original', '04 Jul 2017', '1008', 'photos/prf100820170704084501.jpg', 'Venus as a boy', ' ', ' ', 'Solo Performer', 1, 0, '2017-07-04 21:32:34'),
(1003, 'Secret of Fire', 'audio/trk100620170704081309.mp3', 'Original', '04 Jul 2017', '1006', 'photos/prf100620170704080419.jpg', 'Andy Hiles', 'the great grandaddy of blues', 'singer song writer and guitar player', 'Solo Performer', 2, 1, '2017-07-04 21:32:34'),
(1004, 'Johnny Parlez', 'audio/trk100620170704081112.mp3', 'Original', '04 Jul 2017', '1006', 'photos/prf100620170704080419.jpg', 'Andy Hiles', 'the great grandaddy of blues', 'singer song writer and guitar player', 'Solo Performer', 2, 1, '2017-07-04 21:32:34'),
(1005, 'Mama Mia', 'audio/trk100520170704075907.mp3', 'Cover', '04 Jul 2017', '1005', 'photos/prf100520170704075304.jpg', '2tanium', 'popular cover duo', 'large repertoire of songs from all eras', 'Band / Group', 1, 1, '2017-07-04 21:32:34'),
(1006, 'Pack up and fly away', 'audio/trk100320170704074146.mp3', 'Original', '04 Jul 2017', '1003', 'photos/prf100320170704072120.jpg', 'Michael Cochrane', 'Talented singer songwriter from Belfast', 'Singer-songwriter at Singer-songwriter\nStudied at Belfast Metropolitan College\nLives in Edinburgh, United Kingdom\nFrom Belfast, United Kingdom', 'Solo Performer', 2, 1, '2017-07-04 21:32:34'),
(1007, 'Lucia Sunshine', 'audio/trk100320170704073019.mp3', 'Original', '04 Jul 2017', '1003', 'photos/prf100320170704072120.jpg', 'Michael Cochrane', 'Talented singer songwriter from Belfast', 'Singer-songwriter at Singer-songwriter\nStudied at Belfast Metropolitan College\nLives in Edinburgh, United Kingdom\nFrom Belfast, United Kingdom', 'Solo Performer', 2, 1, '2017-07-04 21:32:34'),
(1008, 'Sensation', 'http://feeds.soundcloud.com/stream/281220384-lyndonsutcliffe-rock-and-roll-queen.mp3', 'Original', '30 Jun 2017', '1002', 'photos/prf100220170630085013.jpg', 'Lyndon', 'the one and only', 'Singer songwriter guitar player. with a wide range of original material', 'Solo Performer', 2, 2, '2017-07-04 21:32:34'),
(1009, 'Shoulder to cry on', 'http://feeds.soundcloud.com/stream/255622150-lyndonsutcliffe-shoulder-to-cry-on-1.mp3', 'Original', '30 Jun 2017', '1002', 'photos/prf100220170630085013.jpg', 'Lyndon', 'the one and only', 'Singer songwriter guitar player. with a wide range of original material', 'Solo Performer', 2, 2, '2017-07-04 21:32:34');

-- --------------------------------------------------------

--
-- Table structure for table `fb_rel`
--

CREATE TABLE IF NOT EXISTS `fb_rel` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_descr` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `fb_security`
--

CREATE TABLE IF NOT EXISTS `fb_security` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_email` varchar(50) NOT NULL,
  `fb_pwd` varchar(200) NOT NULL,
  `fb_question` varchar(20) NOT NULL,
  `fb_response` varchar(50) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1007 ;

--
-- Dumping data for table `fb_security`
--

INSERT INTO `fb_security` (`fb_id`, `fb_email`, `fb_pwd`, `fb_question`, `fb_response`, `fb_created`) VALUES
(1000, 'l11vdo@gmail.com', '$2a$10$8329c3ae80d8f0b402f4eeT5dCnkd4lTkTRZjWxiWRAfIAyKvQVLe', 'Pets name', 'Nelson', '2017-06-29 11:02:41'),
(1001, 'l11vdo+01@gmail.com', '$2a$10$8378a8866aa9bbfdd9405ug2YEnnQIOsvDYQw2JxFtRtrSa7KD6Du', '', '', '2017-07-04 18:12:59'),
(1002, 'l11vdo+02@gmail.com', '$2a$10$6e72bc33edaef628db8e1uhZOOcowz1OTM3ad6DSQb.iDi8shexkK', '', '', '2017-07-04 18:46:00'),
(1003, 'l11vdo+03@gmail.com', '$2a$10$470b3b1ecbdf4d08b3eccuiyk6WHb2cyVLlRx78T.wrUz0s2h9GuC', '', '', '2017-07-04 19:02:31'),
(1004, 'l11vdo+04@gmail.com', '$2a$10$1c4b5fcff59a8c923b8ffuRd0tqsu83af4p6zRXVRlveMo75uAshu', '', '', '2017-07-04 19:17:45'),
(1005, 'l11vdo+05@gmail.com', '$2a$10$2e019b76af7755c5af2cdO8SI29qyTb2NUxc.n58X17HfFJ1bzX92', '', '', '2017-07-04 19:40:11'),
(1006, 'l11vdo+06@gmail.com', '$2a$10$851e7d4ad6b5dfb9bf0dbOhHgYSaH6z7Y0t1J3CSfPWbk6pn1ln/q', '', '', '2017-07-04 19:58:58');

-- --------------------------------------------------------

--
-- Table structure for table `fb_track`
--

CREATE TABLE IF NOT EXISTS `fb_track` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_track_type` varchar(20) NOT NULL,
  `fb_url_type` varchar(20) NOT NULL,
  `fb_title` varchar(100) NOT NULL,
  `fb_track_url` varchar(100) NOT NULL,
  `fb_descr` varchar(300) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `fb_track`
--

INSERT INTO `fb_track` (`fb_id`, `fb_track_type`, `fb_url_type`, `fb_title`, `fb_track_url`, `fb_descr`, `fb_created`) VALUES
(1, 'Original', 'External', 'Shoulder to cry on', 'http://feeds.soundcloud.com/stream/255622150-lyndonsutcliffe-shoulder-to-cry-on-1.mp3', '', '2017-06-30 15:28:12'),
(2, 'Original', 'External', 'Sensation', 'http://feeds.soundcloud.com/stream/281220384-lyndonsutcliffe-rock-and-roll-queen.mp3', '', '2017-06-30 15:37:13'),
(3, 'Original', 'Upload', 'Lucia Sunshine', 'audio/trk100320170704073019.mp3', '', '2017-07-04 18:30:25'),
(5, 'Original', 'Upload', 'Pack up and fly away', 'audio/trk100320170704074146.mp3', '', '2017-07-04 18:41:47'),
(6, 'Cover', 'Upload', 'Mama Mia', 'audio/trk100520170704075907.mp3', '', '2017-07-04 18:59:13'),
(7, 'Original', 'Upload', 'Johnny Parlez', 'audio/trk100620170704081112.mp3', '', '2017-07-04 19:11:12'),
(8, 'Original', 'Upload', 'Secret of Fire', 'audio/trk100620170704081309.mp3', '', '2017-07-04 19:13:17'),
(9, 'Original', 'Upload', 'Auld Reekie', 'audio/trk100820170704085018.mp3', '', '2017-07-04 19:50:18'),
(10, 'Cover', 'Upload', 'ring of fire', 'audio/trk100720170704085435.mp3', '', '2017-07-04 19:54:38'),
(11, 'Original', 'Upload', 'Jim Cozens band', 'audio/trk100920170704090255.mp3', '', '2017-07-04 20:02:56');

-- --------------------------------------------------------

--
-- Table structure for table `fb_weblinks`
--

CREATE TABLE IF NOT EXISTS `fb_weblinks` (
  `fb_id` int(11) NOT NULL AUTO_INCREMENT,
  `fb_type` varchar(30) NOT NULL,
  `fb_descr` varchar(100) NOT NULL,
  `fb_link` varchar(100) NOT NULL,
  `fb_photo` varchar(100) NOT NULL,
  `fb_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fb_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

--
-- Dumping data for table `fb_weblinks`
--

INSERT INTO `fb_weblinks` (`fb_id`, `fb_type`, `fb_descr`, `fb_link`, `fb_photo`, `fb_created`) VALUES
(2, 'Video Stream', 'Cafe du Mistral - youtube video', 'https://www.youtube.com/watch?v=gW0M-iB8TNo', 'photos/tnl100220170630044441.jpg', '2017-06-30 15:46:47'),
(3, 'Video Stream', 'The story of the beat - live', 'https://www.youtube.com/watch?v=md4cRWdyM_8', 'photos/tnl100220170630044643.jpg', '2017-06-30 15:46:47'),
(10, 'Video Stream', 'Wish you were here - classic pink floyd cover', 'https://www.youtube.com/watch?v=iYbrsS4G0pg&feature=youtu.be', 'photos/prf100320170704072120.jpg', '2017-07-05 10:25:04'),
(13, 'Video Stream', 'Mr Blue Sky', 'https://www.youtube.com/watch?v=cr0GZ27KCZ4', 'photos/prf100520170704075304.jpg', '2017-07-05 10:28:21'),
(16, 'Video Stream', 'The Hare On The Hill live', 'https://www.facebook.com/Fretworxmusic/videos/1152045651607769/', 'photos/prf100620170704080419.jpg', '2017-07-05 10:39:48'),
(19, 'Video Stream', 'Free Fallin - live cover', 'https://www.facebook.com/bahamahouseduo/videos/649498445259405/', 'photos/prf100720170704082343.jpg', '2017-07-05 10:45:51');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
