--
-- Database: `sensornode`
--

-- --------------------------------------------------------

--
-- Table structure for table `sensordata`
--

CREATE TABLE IF NOT EXISTS `sensordata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `temperature` double NOT NULL,
  `humidity` double NOT NULL,
  `pressure` double NOT NULL,
  `compass` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=684 ;

