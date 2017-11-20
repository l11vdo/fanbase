
/* News feed */

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1000;

TRUNCATE TABLE `fb_newsfeed`;

insert into `fb_newsfeed`( `fb_performer_id`, `fb_news_dt`, `fb_news_event`, `fb_name`, `fb_photo`, `fb_type`, `fb_added_dt`, `fb_strapline`, `fb_descr`, `fb_track_count`, `fb_link_count`)
select p.fb_id as fb_performer_id,
       DATE_FORMAT(p.fb_created,'%Y%m%d') as fb_news_dt,
       'Performer' as fb_news_event,
       p.fb_name,
       p.fb_photo,
       p.fb_type,
       DATE_FORMAT(p.fb_created,'%d %b %Y') as  fb_added_dt,
       IFNULL(pd.fb_strapline,' ') as fb_strapline,
       IFNULL(pd.fb_descr,' ') as fb_descr,
       (select count(*) from fb_link l, fb_track t where t.fb_id=l.fb_id2 and l.fb_relid=91 and l.fb_id1=p.fb_id) as fb_track_count,
       (select count(*) from fb_link l, fb_weblinks t where t.fb_id=l.fb_id2 and l.fb_relid=81 and l.fb_id1=p.fb_id) as fb_link_count
       from fb_performer p
       left join (select l.fb_id1,
                         d.fb_strapline,
                         d.fb_descr from fb_link l,
                         fb_performerdetail d
                         where l.fb_relid=71
                         and l.fb_id2=d.fb_id) pd
       on pd.fb_id1 = p.fb_id
       order by p.fb_created desc limit 10;

insert into `fb_newsfeed`( `fb_performer_id`, `fb_news_dt`, `fb_news_event`, `fb_title`, `fb_photo`, `fb_track_type`,  `fb_url_type`, `fb_track_url`, `fb_descr`, `fb_added_dt`, `fb_name`)
select p.fb_id as fb_performer_id,
       DATE_FORMAT(p.fb_created,'%Y%m%d') as fb_news_dt,
       'Track' as fb_news_event,
       t.fb_title,
       p.fb_photo,
       t.fb_track_type,
       t.fb_url_type,
       t.fb_track_url,
       t.fb_descr,
       DATE_FORMAT(t.fb_created,'%d %b %Y') as  fb_added_dt,
       p.fb_name
       from fb_track t, fb_performer p, fb_link l
       where t.fb_id=l.fb_id2 and l.fb_relid=91 and l.fb_id1=p.fb_id
       order by t.fb_created desc limit 10;

insert into `fb_newsfeed`( `fb_performer_id`, `fb_media_id`, `fb_news_dt`, `fb_news_event`, `fb_descr`, `fb_type`, `fb_added_dt`, `fb_photo`, `fb_name`, `fb_link`)
select p.fb_id as fb_performer_id,
       w.fb_id as fb_media_id,
       DATE_FORMAT(p.fb_created,'%Y%m%d') as fb_news_dt,
       'Media' as fb_news_event,
       w.fb_descr,
       w.fb_type,
       DATE_FORMAT(w.fb_created,'%d %b %Y') as fb_added_dt,
       w.fb_photo,
       p.fb_name,
       w.fb_link
       from fb_weblinks w, fb_performer p, fb_link l
       where w.fb_id=l.fb_id2 and l.fb_relid=81 and l.fb_id1=p.fb_id
       order by w.fb_created desc limit 10;