/* Radio feed */

DROP TABLE IF EXISTS `fb_radiofeed`;

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

INSERT INTO `fb_radiofeed` (`fb_title`, `fb_track_url`, `fb_track_type`, `fb_added_dt`, `fb_performer_id`, `fb_photo`, `fb_name`, `fb_strapline`, `fb_descr`, `fb_type`, `fb_track_count`, `fb_link_count`)
SELECT t.fb_title,
       t.fb_track_url, 
       t.fb_track_type, 
       DATE_FORMAT(t.fb_created,'%d %b %Y') as  fb_added_dt,
       p.fb_id as fb_performer_id,
       p.fb_photo,
       p.fb_name,
       IFNULL(pd.fb_strapline,' ') as fb_strapline,
       IFNULL(pd.fb_descr,' ') as fb_descr,
       p.fb_type,
       (select count(*) from fb_link l, fb_track t where t.fb_id=l.fb_id2 and l.fb_relid=91 and l.fb_id1=p.fb_id) as fb_track_count,
       (select count(*) from fb_link l, fb_weblinks t where t.fb_id=l.fb_id2 and l.fb_relid=81 and l.fb_id1=p.fb_id) as fb_link_count
       from fb_track t, fb_link l, fb_performer p
       left join (select l1.fb_id1,
                         d1.fb_strapline,
                         d1.fb_descr from fb_link l1,
                         fb_performerdetail d1
                         where l1.fb_relid=71
                         and l1.fb_id2=d1.fb_id) pd
        on pd.fb_id1 = p.fb_id
        where t.fb_id = l.fb_id2
        and p.fb_id = l.fb_id1
        and l.fb_relid = 91
        order by t.fb_created
        desc limit 20;