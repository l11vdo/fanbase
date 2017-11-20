<?php 
$app->get('/session', function() {
    $db = new DbHandler();
    echoResponse(200, $db->getSession());
});

$app->post('/setSession', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $r = json_decode($app->request->getBody());
    foreach($r as $key=>$value) {
        $_SESSION[$key] = $value;
    }
    $response["status"] = "success";
    $response["message"] = json_encode($r);
    echoResponse(200, $response);
});

$app->post('/unsetSession', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $r = $app->request->getBody();
    $response["message"] = "Unknown key ".$r;
    if (isSet($_SESSION[$r]))
    {
        unset($_SESSION[$r]);
        $response["status"] = "success";
        $response["message"] = "Unposted key ".$r;
    }
    else {
        $response["status"] = "error";
        $response["message"] = "No key ".$r;
    }
    echoResponse(200, $response);
});

$app->post('/getSession', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $r = $app->request->getBody();
    $response["status"] = "error";
    $response["message"] = "Unknown key ".$r;
    if (isSet($_SESSION[$r]))
    {
        $response["value"] = $_SESSION[$r];
        $response["message"] = "Reloaded key ".$r;
        $response["status"] = "success";
    }
    echoResponse(200, $response);    
});

$app->get('/getNewsFeed', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }

    $response = array();

    $qry="select fb_news_dt,fb_performer_id,fb_added_dt,fb_news_event,fb_title,fb_type,fb_track_type,fb_track_url,fb_url_type,fb_track_count,fb_link_count,fb_photo,fb_name,fb_strapline,fb_descr, fb_link, DATE_FORMAT(fb_created,'%d %b %Y') as fb_created_dt from fb_newsfeed f order by fb_news_dt desc";

    $response["fb_newsfeed"] = $db->getMultiRecords($qry);
    $response["status"] = count($response["fb_newsfeed"])>0?"success":"info";
    $response["message"] = "News Feed Loaded";

    echoResponse(200, $response);
});

$app->get('/getRadioFeed', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }

    $response = array();
    
    $qry="select fb_title, fb_track_url, fb_track_type, fb_added_dt, fb_performer_id, fb_photo, fb_name, fb_strapline, fb_descr, fb_type,";
    $qry.=" fb_track_count, fb_link_count from fb_radiofeed order by fb_created desc";
    $response["fb_trackList"] = $db->getMultiRecords($qry);
    $response["status"] = count($response["fb_trackList"])>0?"success":"info";
    $response["message"] = "Radio Feed Loaded";

    echoResponse(200, $response);
});

$app->post('/login', function() use ($app) {
    require_once 'passwordHash.php';
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('fb_email', 'fb_pwd'),$r->fb_person);
    $response = array();
    $db = new DbHandler();
    $fb_pwd = $r->fb_person->fb_pwd;
    $fb_email = $r->fb_person->fb_email;

    $qry="select p.fb_id,p.fb_name,p.fb_pwd,p.fb_email,p.fb_country,p.fb_photo";
    $qry.=" from fb_person p where p.fb_email='".$fb_email."'";
    $user = $db->getOneRecord($qry);
    if ($user != NULL) {
      if(passwordHash::check_password($user['fb_pwd'],$fb_pwd)){
        $response['status'] = "success";
        $response['message'] = 'Logged in successfully.';
        $response['fb_name'] = $user['fb_name'];
        $response['fb_id'] = $user['fb_id'];
        $response['fb_email'] = $user['fb_email'];
        $response['fb_country'] = $user['fb_country'];
        $response['fb_photo'] = $user['fb_photo'];

        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['fb_id'] = $user['fb_id'];
        $_SESSION['fb_name'] = $user['fb_name'];
        $_SESSION['fb_photo'] = $user['fb_photo'];
      }
      else {
        $response['status'] = "error";
        $response['message'] = 'Login failed. Incorrect credentials';
      }
    }
    else {
      $response['status'] = "error";
      $response['message'] = 'No such user is registered';
    }
    echoResponse(200, $response);
});

$app->get('/homePage', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["fb_id"];
    $response = array();
 
    $qry="select p.fb_name,p.fb_email,p.fb_photo from fb_person p where p.fb_id='".$fb_id."'";
    $user = $db->getOneRecord($qry);
    if ($user != NULL) {
        $response["fb_person"] = $user;
        $response["status"] = "success";
        $response["message"] = "ID data loaded successfully";
    }
    else {
        $response["status"] = "info";
        $response["message"] = "No user found";

    }

    echoResponse(200, $response);
});


$app->get('/logout', function() {
    $db = new DbHandler();
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
    echoResponse(200, $response);
});

$app->post('/findAddress', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    $fb_postcode = $r->fb_address->fb_postcode;
    $fb_house_nr = $r->fb_address->fb_house_nr;
    $postcode = urlencode($fb_postcode);
    $query = 'http://maps.googleapis.com/maps/api/geocode/json?address='.$postcode.'&sensor=false';

    $result = json_decode(file_get_contents($query));
    $lat = $result->results[0]->geometry->location->lat;
    $lng = $result->results[0]->geometry->location->lng;


// Get the address based on returned lat & long
    $address_url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' . $lat . ',' . $lng . '&sensor=false';
    try {
        $jsondata = json_decode(file_get_contents($address_url),true);
    

// If the json data is invalid, return empty array
        if (check_status($jsondata)){
            $response["fb_house_nr"] = $fb_house_nr;
            $response["fb_postcode"] = google_getPostalCode($jsondata);
            $response["fb_street"] = google_getStreet($jsondata);
            $response["fb_city"] = google_getCity($jsondata);
            $response["fb_county"] = google_getProvince($jsondata);
            $response["fb_country"] = google_getCountry($jsondata);
            $response["fb_formatted"] = formatted_address($fb_house_nr, $jsondata);
            $response["streets"]=Find_All_Streets($jsondata);
            $response["status"] = "success";
            $response["message"] = formatted_address($fb_house_nr, $jsondata);
            echoResponse(200, $response);
        }else{
            $response["status"] = "error";
            $response["message"] = "Not found";
            echoResponse(201, $response);
        }
    }
    catch (Exception $e) {
        $response["status"] = "error";
        $response["message"] = $e->getMessage();
        echoResponse(201, $response);
    }
});

$app->post('/saveAddress', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    if (isset($_SESSION["fb_id"])) {
        $fb_id=$_SESSION["fb_id"];
        $response = array();
        $r = json_decode($app->request->getBody());
        $db = new DbHandler();
        $tabble_name = "fb_address";
        
        $linkquery="select fb_relid, fb_id1, fb_id2 from fb_link where fb_relid=".REL_ADDRESS." AND fb_id1=".$fb_id;
        $fb_link = $db->getOneRecord($linkquery);
        
        if ($fb_link!=NULL) {
            $result=$db->deleteRecord($fb_link["fb_id2"],$tabble_name);
            $result=$db->deleteLink($fb_link["fb_relid"], $fb_link["fb_id1"], $fb_link["fb_id2"]);}
        
        $column_names = array('fb_id', 'fb_house_nr', 'fb_street', 'fb_city', 'fb_postcode', 'fb_county', 'fb_country', 'fb_formatted','fb_created');
        $result = $db->insertIntoTable($r->fb_address, $column_names, $tabble_name);
        if ($result != NULL) {
            $address_id=$result;
            $result1=$db->insertLink(REL_ADDRESS,$fb_id,$address_id);
            $city=ucwords(trim($r->fb_address->fb_city));
            $qry = "update fb_person set fb_city='".$city."' where fb_id=".$fb_id;
            $db->execSQL($qry);}
                
        $response["status"] = "success";
        $response["message"] = "Address Saved";
    } else {
        $response["status"] = "error";
        $response["message"] = "Sorry, we were unable to process your request. Please sign in or sign up as a Fanbase member.";
    }
    echoResponse(200, $response);
});

$app->post('/saveIdentity', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["fb_id"];
    if (isset($_SESSION["fb_id"])) {
        $response = array();
        $r = json_decode($app->request->getBody());
        $db = new DbHandler();
        $tabble_name = "fb_identity";
        
        $linkquery="select fb_relid, fb_id1, fb_id2 from fb_link where fb_relid=".REL_IDENTITY." AND fb_id1=".$fb_id;
        $fb_link = $db->getOneRecord($linkquery);
        
        if ($fb_link!=NULL) {
            $result=$db->deleteRecord($fb_link["fb_id2"],$tabble_name);
            $result=$db->deleteLink($fb_link["fb_relid"], $fb_link["fb_id1"], $fb_link["fb_id2"]);}
            
        $query = "INSERT INTO fb_identity (fb_alias,fb_title,fb_name_first,fb_name_middle,fb_name_last,fb_gender,fb_birth_date) ";
        $query .= " VALUES (";
        $query .=  "'".$r->fb_identity->fb_alias."', ";
        $query .=  "'".$r->fb_identity->fb_title."', ";
        $query .=  "'".$r->fb_identity->fb_name_first."', ";
        $query .=  "'".$r->fb_identity->fb_name_middle."', ";
        $query .=  "'".$r->fb_identity->fb_name_last."', ";
        $query .=  "'".$r->fb_identity->fb_gender."', ";
        $query .=  "'".substr($r->fb_identity->fb_birth_date,0,10)."')";
            
        $result = $db->execSQL($query);
        if ($result != NULL) {
            $identity_id=$result;
            $result1=$db->insertLink(REL_IDENTITY,$fb_id,$identity_id);
            $name=ucwords(trim($r->fb_identity->fb_name_first)." ".trim($r->fb_identity->fb_name_middle)." ".trim($r->fb_identity->fb_name_last));
            $qry = "update fb_person set fb_name='".$name."' where fb_id=".$fb_id;
            $db->execSQL($qry);
            $_SESSION["fb_name"] = $name;}
            
        $response["fb_name"] = $name;
        $response["fb_birth_date"] = $r->fb_identity->fb_birth_date;
        $response["status"] = "success";
        $response["message"] = "Identity Saved";
    } else {
        $response["status"] = "error";
        $response["message"] = "Sorry, we were unable to process your request. Please sign in or sign up as a Fanbase member.";
    }
    echoResponse(200, $response);
});

$app->get('/getaddress', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["fb_id"];
    $response = array();
    $qry="select a.fb_id, a.fb_house_nr, a.fb_street, a.fb_city, a.fb_postcode, a.fb_county, a.fb_country, a.fb_formatted ";    
    $qry.="from fb_link l, fb_address a where l.fb_relid=".REL_ADDRESS." AND l.fb_id1=".$fb_id;
    $qry.=" and a.fb_id=l.fb_id2";

    $response["fb_house_nr"] = '';
    $response["fb_postcode"] = '';
    $response["fb_street"] = '';
    $response["fb_city"] = '';
    $response["fb_county"] = '';
    $response["fb_country"] = '';
    $response["fb_formatted"] = '';

    $addr = $db->getOneRecord($qry);
    if ($addr!=NULL) {
        $response["fb_house_nr"] = $addr["fb_house_nr"];
        $response["fb_postcode"] = $addr["fb_postcode"];
        $response["fb_street"] = $addr["fb_street"];
        $response["fb_city"] = $addr["fb_city"];
        $response["fb_county"] = $addr["fb_county"];
        $response["fb_country"] = $addr["fb_country"];
        $response["fb_formatted"] = $addr["fb_formatted"];

        $response["status"] = "success";
        $response["message"] = "Address loaded successfully";}
    else {
        $response["info"] = "info";
        $response["message"] = "No address entered";}

    echoResponse(200, $response);
});

$app->get('/getIdentity', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["fb_id"];
    $response = array();
 
    $qry="select i.fb_id, i.fb_alias, i.fb_title, i.fb_name_first, i.fb_name_middle, i.fb_name_last, i.fb_gender, i.fb_birth_date";    
    $qry.=" from fb_link l, fb_identity i where l.fb_relid=".REL_IDENTITY." AND l.fb_id1=".$fb_id;
    $qry.=" and i.fb_id=l.fb_id2";

    $response["fb_alias"] = '';
    $response["fb_title"] = '';
    $response["fb_name_first"] = '';
    $response["fb_name_middle"] = '';
    $response["fb_name_last"] = '';
    $response["fb_gender"] = '';
    $response["fb_birth_date"] = null;

    $ident = $db->getOneRecord($qry);
    if ($ident!=NULL)
    {
        $response["fb_alias"] = $ident["fb_alias"];
        $response["fb_title"] = $ident["fb_title"];
        $response["fb_name_first"] = $ident["fb_name_first"];
        $response["fb_name_middle"] = $ident["fb_name_middle"];
        $response["fb_name_last"] = $ident["fb_name_last"];
        $response["fb_gender"] = $ident["fb_gender"];
        $response["fb_birth_date"] = $ident["fb_birth_date"];
        $response["status"] = "success";
        $response["message"] = "ID data loaded successfully";
    }
    else {
        $response["status"] = "info";
        $response["message"] = "No identity found";

    }

    echoResponse(200, $response);
});

$app->get('/getphoto', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }
    if (isset($_SESSION["performer_id"])) {
        $fb_id=$_SESSION["performer_id"];
        $rel = REL_PERF_PHOTO;
        $prefix = PERFORMER_PREFIX;
        $msg = "Performer cover photo updated";}
    else {
        $fb_id=$_SESSION["fb_id"];
        $rel = REL_MEMB_PHOTO;
        $prefix = MEMBER_PREFIX;
        $msg = "Fanbase profile photo updated";}
    
    $response = array();
    $qry="select p.fb_id, p.fb_filename";    
    $qry.=" from fb_link l, fb_photo p where l.fb_relid=".$rel." AND l.fb_id1=".$fb_id;
    $qry.=" and p.fb_id=l.fb_id2";

    $response["fb_filename"] = '';
    $photo = $db->getOneRecord($qry);
    if ($photo!=NULL)
    {
        $response["fb_id"] = $photo["fb_id"];
        $response["fb_filename"] = $photo["fb_filename"];
        $response["status"] = "success";
        $response["message"] = "Photo found";}
    else{
        $response["status"] = "info";
        $response["message"] = "No photo found";}

    echoResponse(200, $response);
});

$app->post('/savePhoto', function() use ($app) {

    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $tabble_name = "fb_photo";
    $rel_arc = 0;

    if ($r->fb_photo->photo_type == 'Profile') {
        $fb_id=$r->fb_photo->fb_id;
        $rel = REL_MEMB_PHOTO;
        $rel_arc = REL_MEMB_PHOTO_ARC;
        $prefix = MEMBER_PREFIX;
    }
    if ($r->fb_photo->photo_type == 'Performer') {
        $fb_id=$r->fb_photo->performer_id;
        $rel = REL_PERF_PHOTO;
        $rel_arc = REL_PERF_PHOTO_ARC;
        $prefix = PERFORMER_PREFIX;
    }
    if ($r->fb_photo->photo_type == 'News') {
        $fb_id=$r->fb_photo->news_id;
        $rel = REL_NEWS_PHOTO;
        $prefix = NEWS_PREFIX;
    }
    if ($rel_arc > 0) {
        $qry = "update fb_link set fb_relid=".$rel_arc." where fb_id1=".$fb_id." and fb_relid=".$rel;
        $db->execSQL($qry);
    }

    $photo = $r->fb_photo;
    if ($photo->fb_filename=='') {
        date_default_timezone_set("Europe/London");
        $jpgname=PHOTO_REPOSITORY.$prefix.sprintf("%08d", $fb_id).date("Ymdhis").".jpg";
        $photo->fb_filename=$jpgname;
    }
    $imageStr = base64_decode(substr($r->fb_photo->base64, 1+strrpos($r->fb_photo->base64, ',')));
    $image = imagecreatefromstring($imageStr);
    imagejpeg($image, '../../'.$photo->fb_filename);
        
    $column_names = array('fb_filename');
    $result = $db->insertIntoTable($photo, $column_names, $tabble_name);
    if ($result != NULL) {
        $photo_id=$result;
        $result1=$db->insertLink($rel,$fb_id,$photo_id);
    }
    
    if ($r->fb_photo->photo_type == 'Profile') {
        $qry = "update fb_person set fb_photo='".$jpgname."' where fb_id=".$fb_id;
    }
    if ($r->fb_photo->photo_type == 'Performer') {
        $qry = "update fb_performer set fb_photo='".$jpgname."' where fb_id=".$fb_id;
    }

    if ($r->fb_photo->photo_type == 'News') {
        if ($fb_id > 0) {
            $qry = "update fb_newsitem set fb_photo='".$jpgname."' where fb_id=".$fb_id;
        }
    }
    $db->execSQL($qry);
    
    $response["fb_photo"] = $photo->fb_filename;
    $response["status"] = "success";
    $response["message"] = $r->fb_photo->photo_type." photo saved... ".$photo->fb_filename;
    echoResponse(200, $response);
});

$app->post('/saveContactList', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["fb_id"];
    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $tabble_name = "fb_contact";

    $del="delete from fb_contact where fb_id in";
    $del.=" (select fb_id2 from fb_link where fb_relid=".REL_CONTACT." and fb_id1=".$fb_id.")";
    $result = $db->execSQL($del);

    $del="delete from fb_link where fb_relid=".REL_CONTACT." and fb_id1=".$fb_id;
    $result = $db->execSQL($del);

    $response["status"] = "success";
    $response["message"] = "Contact details saved";

    $list=$r->contactList;
    foreach($list as $contact){
        $column_names = array('fb_contact_type','fb_contact_detail');
        $tabble_name = 'fb_contact';
        $result = $db->insertIntoTable($contact, $column_names, $tabble_name);
        if ($result != NULL) {
           $contact_id=$result;
           $result1=$db->insertLink(REL_CONTACT,$fb_id,$contact_id);
           if ($result1 == NULL) {
              $response["error"] = "error";
              $response["message"] = "link ".$fb_id.", ".$contact_id;}
        }
        else {
            $response["error"] = "error";
            $response["message"] = $query;}          
    }

    echoResponse(200, $response);
});

$app->get('/getSecurity', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }
    $response["status"] = "warning";
    $response["message"] = "no security profile";
    if (isset($_SESSION["fb_id"])) {
        $fb_id=$_SESSION["fb_id"];
        $_SESSION["original_email"]="";
        $response = array();
        
        $qry="select s.fb_email, s.fb_pwd, s.fb_question, s.fb_response,  s.fb_pwd as orig_pwd";    
        $qry.=" from fb_link l, fb_security s where l.fb_relid=".REL_SECURITY." AND l.fb_id1=".$fb_id;
        $qry.=" and s.fb_id=l.fb_id2";
        $sec = $db->getOneRecord($qry);
        if ($sec!=NULL) {
            $_SESSION["original_email"] = $sec["fb_email"];
            $response["fb_security"] = $sec;
            $response["status"] = "success";
            $response["message"] = "security profile loaded";
        }
    }
    echoResponse(200, $response);
});

$app->post('/saveSecurity', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $response = array();
    $r = json_decode($app->request->getBody());
    $fb_name = '';
    $fb_email = $r->fb_security->fb_email;
    $fb_pwd = $r->fb_security->fb_pwd;
    if ($r->fb_security->fb_pwd != $r->fb_security->orig_pwd) {
      $fb_pwd = passwordHash::hash($r->fb_security->fb_pwd);
      $r->fb_security->fb_pwd = $fb_pwd;
    }
    $db = new DbHandler();

    if (!isset($_SESSION["fb_id"])) {
      $tabble_name = "fb_person";
      $column_names = array('fb_email', 'fb_pwd', 'fb_photo');
      $result = $db->insertIntoTable($r->fb_security, $column_names, $tabble_name);
      $_SESSION["fb_id"] = $result;
      $fb_name = "user".$result;
      $_SESSION["fb_name"] = $fb_name;
      $qry = "update fb_person set fb_name='".$fb_name."' where fb_id=".$result;
      $db->execSQL($qry);
    }
    $fb_id=$_SESSION["fb_id"];

    $tabble_name = "fb_security";
    $linkquery="select fb_relid, fb_id1, fb_id2 from fb_link where fb_relid=".REL_SECURITY." AND fb_id1=".$fb_id;
    $fb_link = $db->getOneRecord($linkquery);
    
    if ($fb_link!=NULL) {
      $result=$db->deleteRecord($fb_link["fb_id2"],$tabble_name);
      $result=$db->deleteLink($fb_link["fb_relid"], $fb_link["fb_id1"], $fb_link["fb_id2"]);}

    $column_names = array('fb_email', 'fb_pwd', 'fb_question', 'fb_response');

    $result = $db->insertIntoTable($r->fb_security, $column_names, $tabble_name);
    if ($result != NULL) {
      $sec_id=$result;
      $result1=$db->insertLink(REL_SECURITY,$fb_id,$sec_id);}
    
    $qry = "update fb_person set fb_email='".$fb_email."', fb_pwd='".$fb_pwd."' where fb_id=".$fb_id;
    $db->execSQL($qry);
    $response["fb_id"] = $fb_id;
    $response["fb_name"] = $fb_name;
    $response["status"] = "success";
    $response["message"] = "Security Profile Saved";
    if ($fb_name!='') {
        $response["message"] .= ' for '.$fb_name;
    }
    echoResponse(200, $response);
});

$app->post('/verifyEmail', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $r = json_decode($app->request->getBody());
    $fb_email = $r->fb_security->fb_email;

    $db = new DbHandler();
    $userExists = $db->getOneRecord("select 1 from fb_person where fb_email='".$fb_email."'");
    if(!$userExists){
      $_SESSION["email_code"] = base64_encode(rand(100001,999900));
      $response = array();

      $subject="Fanbase verification code ".base64_decode($_SESSION["email_code"]);
      $msg="Welcome to Fanbase. This is an automated e-mail. Please enter the code in the title as the e-mail validation code in the fanbase app.";
      $headers = "From: admin@fanbase.zone\r\n";
      if (mail($fb_email,$subject,$msg,$headers)) {
        $response["status"] = "success";
        $response["message"] = "Please check your email for the 6 digit validation code";}  
      else {
        $response["status"] = "success";
        $response["message"] = "Mail failed";}
    }
    else {
      $response["status"] = "error";
      $response["message"] = "This email address is already registered on Fanbase";}
    echoResponse(200, $response);
});

$app->post('/validateEmail', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $r = json_decode($app->request->getBody());
    $email_code = base64_decode($_SESSION["email_code"]);

    $fb_validation_code = $r->fb_security->fb_validation_code;
    if ($fb_validation_code == $email_code){
      $response["status"] = "success";
      $response["message"] = "Your email address has now been validated.";}
    else {
      $response["status"] = "error";
      $response["message"] = "Invalid verification code";}

    echoResponse(200, $response);
});

$app->get('/getContactList', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["fb_id"];
    $response = array();

    $qry="select c.fb_id, c.fb_contact_type, c.fb_contact_detail";    
    $qry.=" from fb_link l, fb_contact c where l.fb_relid=".REL_CONTACT." AND l.fb_id1=".$fb_id;
    $qry.=" and c.fb_id=l.fb_id2";

    $response["fb_contactList"] = $db->getMultiRecords($qry);
    $response["status"] = "success";
    $response["message"] = "Contacts Loaded";

    echoResponse(200, $response);
});

$app->get('/getperformerList', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["fb_id"];
    $response = array();

    $qry  = 'select p.fb_id as fb_performer_id, p.fb_name, p.fb_photo, p.fb_type, DATE_FORMAT(p.fb_created,\'%d %b %Y\') as fb_joinDt, IFNULL(pd.fb_strapline,\' \') as fb_strapline, IFNULL(pd.fb_descr,\' \') as fb_descr, (select count(*) from fb_link l, fb_track t where t.fb_id=l.fb_id2 and l.fb_relid=91 and l.fb_id1=p.fb_id) as fb_trackCount, (select count(*) from fb_link l, fb_weblinks t where t.fb_id=l.fb_id2 and l.fb_relid=71 and l.fb_id1=p.fb_id) as fb_linkCount from fb_performer p left join (select l.fb_id1, d.fb_strapline, d.fb_descr from fb_link l, fb_performerdetail d where l.fb_relid=71 and l.fb_id2=d.fb_id) pd on pd.fb_id1 = p.fb_id, fb_link l where l.fb_id1 = '.$fb_id.' and l.fb_relid = 51 and l.fb_id2 = p.fb_id order by p.fb_created desc limit 10';
    $response["fb_performerList"] = $db->getMultiRecords($qry);
    $response["status"] = "success";
    $response["message"] = "Performer Profiles Loaded";

    echoResponse(200, $response);
});

$app->post('/savePerformer', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["fb_id"];
    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $tabble_name = 'fb_performer';
    $column_names = array('fb_name', 'fb_type', 'fb_status','fb_photo');
    $result = $db->insertIntoTable($r->fb_performer, $column_names, $tabble_name);
    if ($result == NULL) {
        $response["status"] = "error";
        $response["message"] = "Performer Profile could not be saved";}
    else {
        $pp_id=$result;
        $result1=$db->insertLink(REL_PERFORMER,$fb_id,$pp_id);
        $response["performer_id"] = $pp_id;
        $response["status"] = "success";
        $response["message"] = "Basic profile saved, tap Profile to complete entry";}

    echoResponse(200, $response);
});

$app->get('/getWeblinkList', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["performer_id"];
    $response = array();

    $qry="select c.fb_id, c.fb_type, c.fb_descr, c.fb_link, c.fb_photo";    
    $qry.=" from fb_link l, fb_weblinks c where l.fb_relid=".REL_PERF_WEBLINKS." AND l.fb_id1=".$fb_id;
    $qry.=" and c.fb_id=l.fb_id2";

    $response["fb_weblinkList"] = $db->getMultiRecords($qry);
    $response["status"] = count($response["fb_weblinkList"])>0?"success":"info";
    $response["message"] = "Web Links Loaded";

    echoResponse(200, $response);
});

$app->post('/saveWeblinkList', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["performer_id"];
    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $tabble_name = "fb_contact";

    $del="delete from fb_weblinks where fb_id in";
    $del.=" (select fb_id2 from fb_link where fb_relid=".REL_PERF_WEBLINKS." and fb_id1=".$fb_id.")";
    $result = $db->execSQL($del);

    $del="delete from fb_link where fb_relid=".REL_PERF_WEBLINKS." and fb_id1=".$fb_id;
    $result = $db->execSQL($del);

    $response["status"] = "success";
    $response["message"] = "Web links saved";

    $list=$r->weblinkList;
    foreach($list as $weblink){
        $column_names = array('fb_type','fb_descr','fb_link','fb_photo');
        $tabble_name = 'fb_weblinks';
        $result = $db->insertIntoTable($weblink, $column_names, $tabble_name);
        if ($result != NULL) {
           $link_id=$result;
           $result1=$db->insertLink(REL_PERF_WEBLINKS,$fb_id,$link_id);
           if ($result1 == NULL) {
              $response["error"] = "error";
              $response["message"] = "link ".$fb_id.", ".$link_id;}
        }
        else {
            $response["error"] = "error";
            $response["message"] = "insert failed";}          
    }

    echoResponse(200, $response);
});

$app->get('/getPerformerDetail', function() use ($app) {

    if (!isset($_SESSION)) {
        session_start();
    }

    $db = new DbHandler();
    $response = array();
    
    $fb_pid=$_SESSION["performer_id"];
    $response = array();
 
    $qry ="select p.fb_name, p.fb_type, p.fb_status, p.fb_photo";
    $qry.=" from fb_performer p where p.fb_id=".$fb_pid;

    $prf = $db->getOneRecord($qry);
    if ($prf!=NULL)
    {
        $response["fb_strapline"] = "";
        $response["fb_descr"] = "";
        $response["fb_name"] = $prf["fb_name"];
        $response["fb_type"] = $prf["fb_type"];
        $response["fb_photo"] = $prf["fb_photo"];
        $response["fb_status"] = $prf["fb_status"];
        $response["status"] = "info";
        $response["message"] = "Performer loaded, please add detail";
        $qry="select d.fb_strapline, d.fb_descr";
        $qry.=" from fb_link l, fb_performerdetail d where l.fb_relid=".REL_PERF_DETAIL." AND l.fb_id1=".$fb_pid;
        $qry.=" and d.fb_id=l.fb_id2";
        $det = $db->getOneRecord($qry);
        if ($det!=NULL)
        {
            $response["fb_strapline"] = $det["fb_strapline"];
            $response["fb_descr"] = $det["fb_descr"];
            $response["status"] = "success";
            $response["message"] = "Performer detail loaded";
        }
    }
    else {
        $response["status"] = "warning";
        $response["message"] = $fb_pid." - no performer profile";
    }
    echoResponse(200, $response);
});

$app->post('/savePerformerDetail', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["performer_id"];
    $response = array();
    $r = json_decode($app->request->getBody());

    $db = new DbHandler();

    $tabble_name = "fb_performerdetail";
    $linkquery="select fb_relid, fb_id1, fb_id2 from fb_link where fb_relid=".REL_PERF_DETAIL." AND fb_id1=".$fb_id;
    $fb_link = $db->getOneRecord($linkquery);
    
    if ($fb_link!=NULL) {
      $result=$db->deleteRecord($fb_link["fb_id2"],$tabble_name);
      $result=$db->deleteLink($fb_link["fb_relid"], $fb_link["fb_id1"], $fb_link["fb_id2"]);}

    $column_names = array('fb_strapline', 'fb_descr');

    $result = $db->insertIntoTable($r->fb_performerdetail, $column_names, $tabble_name);
    if ($result != NULL) {
      $det_id=$result;
      $result1=$db->insertLink(REL_PERF_DETAIL,$fb_id,$det_id);}
    
    $qry = "update fb_performer set fb_name='".$r->fb_performerdetail->fb_name."',";
    $qry.= " fb_type='".$r->fb_performerdetail->fb_type."',";
//    $qry.= " fb_descr='".$r->fb_performerdetail->fb_descr."',";
    $qry.= " fb_status='".$r->fb_performerdetail->fb_status."' where fb_id=".$fb_id;
    $db->execSQL($qry);

    $response["status"] = "success";
    $response["message"] = "Performer Detail Saved";
    echoResponse(200, $response);
});

$app->post('/setMemberId', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $response = array();
    $r = json_decode($app->request->getBody());
    $_SESSION["fb_member_id"] = $r->fb_member->fb_member_id;
    $response["status"] = "success";
    $response["message"] = "Member Id set ".$_SESSION["fb_member_id"];

    echoResponse(200, $response);
});


$app->get('/getPerfLocations', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $db = new DbHandler();

    $fb_id=$_SESSION["performer_id"];
    $response = array();

    $qry="select c.fb_id, c.fb_type, c.fb_county, c.fb_town";    
    $qry.=" from fb_link l, fb_location c where l.fb_relid=".REL_PERF_LOCATION." AND l.fb_id1=".$fb_id;
    $qry.=" and c.fb_id=l.fb_id2";

    $response["fb_locationList"] = $db->getMultiRecords($qry);
    $response["status"] = count($response["fb_locationList"])>0?"success":"info";
    $response["message"] = "Locations Loaded";

    echoResponse(200, $response);
});

$app->get('/getPersLocations', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["fb_id"];
    $response = array();

    $qry="select c.fb_id, c.fb_type, c.fb_county, c.fb_town";    
    $qry.=" from fb_link l, fb_location c where l.fb_relid=".REL_PERS_LOCATION." and l.fb_id1=".$fb_id;
    $qry.=" and c.fb_id=l.fb_id2";

    $response["fb_locationList"] = $db->getMultiRecords($qry);
    $response["status"] = count($response["fb_locationList"])>0?"success":"info";
    $response["message"] = "Locations Loaded";

    echoResponse(200, $response);
});

$app->get('/getPerformers', function() {
    $db = new DbHandler();
    $response = array();

    $qry="select fb_id as id, fb_name as performer from fb_performer order by fb_name";

    $response["performers"] = $db->getMultiRecords($qry);
    $response["status"] = count($response["performers"])>0?"success":"info";
    $response["message"] = "Locations Loaded";

    echoResponse(200, $response);
});
$app->get('/getTowns', function() {
    $db = new DbHandler();
    $response = array();

    $qry="select town from fb_towns order by town";

    $response["towns"] = $db->getMultiRecords($qry);
    $response["status"] = count($response["towns"])>0?"success":"info";
    $response["message"] = "Locations Loaded";

    echoResponse(200, $response);
});

$app->get('/getCounties', function() {
    $db = new DbHandler();
    $response = array();

    $qry="select county from fb_counties order by county";

    $response["counties"] = $db->getMultiRecords($qry);
    $response["status"] = count($response["counties"])>0?"success":"info";
    $response["message"] = "Locations Loaded";

    echoResponse(200, $response);
});

$app->post('/savePerfLocations', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["performer_id"];
    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $tabble_name = "fb_location";

    $del="delete from fb_location where fb_id in";
    $del.=" (select fb_id2 from fb_link where fb_relid=".REL_PERF_LOCATION." and fb_id1=".$fb_id.")";
    $result = $db->execSQL($del);

    $del="delete from fb_link where fb_relid=".REL_PERF_LOCATION." and fb_id1=".$fb_id;
    $result = $db->execSQL($del);

    $response["status"] = "success";
    $response["message"] = "Location details saved";

    $list=$r->locationList;
    foreach($list as $location){
        $column_names = array('fb_type','fb_town', 'fb_county');
        $tabble_name = 'fb_location';
        $result = $db->insertIntoTable($location, $column_names, $tabble_name);
        if ($result != NULL) {
           $loc_id=$result;
           $result1=$db->insertLink(REL_PERF_LOCATION,$fb_id,$loc_id);
           if ($result1 == NULL) {
              $response["status"] = "error";
              $response["message"] = "link ".$fb_id.", ".$loc_id;}
        }
        else {
            $response["status"] = "error";
            $response["message"] = "error saving location record";}          
    }

    echoResponse(200, $response);
});

$app->post('/savePersLocations', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["fb_id"];
    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $tabble_name = "fb_location";

    $del="delete from fb_location where fb_id in";
    $del.=" (select fb_id2 from fb_link where fb_relid=".REL_PERS_LOCATION." and fb_id1=".$fb_id.")";
    $result = $db->execSQL($del);

    $del="delete from fb_link where fb_relid=".REL_PERS_LOCATION." and fb_id1=".$fb_id;
    $result = $db->execSQL($del);

    $response["status"] = "success";
    $response["message"] = "Location details saved";

    $list=$r->locationList;
    foreach($list as $location){
        $column_names = array('fb_type','fb_town', 'fb_county');
        $tabble_name = 'fb_location';
        $result = $db->insertIntoTable($location, $column_names, $tabble_name);
        if ($result != NULL) {
           $loc_id=$result;
           $result1=$db->insertLink(REL_PERS_LOCATION,$fb_id,$loc_id);
           if ($result1 == NULL) {
              $response["status"] = "error";
              $response["message"] = "link ".$fb_id.", ".$loc_id;}
        }
        else {
            $response["status"] = "error";
            $response["message"] = "error saving location record";}          
    }

    echoResponse(200, $response);
});

$app->post('/unsetMemberId', function() use ($app) {
    if (!isset($_SESSION)) {
      session_start();
    }
    if (isSet($_SESSION['fb_member_id']))
    {
        unset($_SESSION['fb_member_id']);
    }
});

$app->post('/setSearch', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    $_SESSION["fb_search"] = "";
    
    $r = json_decode($app->request->getBody());
    if ($r->fb_search->searchstr!="") {
        switch($r->fb_search->type) {
        case 'Name':
            $_SESSION["fb_search"] = " where match (p.fb_name) against ('".$r->fb_search->searchstr."' in natural language mode)";
            break;
        case 'Town':
            $_SESSION["fb_search"] = " where p.fb_id in (SELECT p1.fb_id FROM fb_performer p1, fb_link k1, fb_location l1 where p1.fb_id=k1.fb_id1 and k1.fb_relid=101 and k1.fb_id2=l1.fb_id and l1.fb_type='Town' and l1.fb_town = '".$r->fb_search->searchstr."')";
            break;
        case 'County':
            $_SESSION["fb_search"] = " where p.fb_id in (SELECT p1.fb_id FROM fb_performer p1, fb_link k1, fb_location l1 where p1.fb_id=k1.fb_id1 and k1.fb_relid=101 and k1.fb_id2=l1.fb_id and l1.fb_type='County' and l1.fb_county = '".$r->fb_search->searchstr."')";
            break;
        }
    }
    $response = array();
    $response["status"] = "info";
    $response["message"] = $_SESSION["fb_search"];
    echoResponse(200, $response);
});

$app->post('/unsetSearch', function() use ($app) {
    if (!isset($_SESSION)) {
      session_start();
    }
    if (isSet($_SESSION['fb_search']))
    {
        unset($_SESSION['fb_search']);
    }
});

$app->delete('/removeMember', function() use ($app) {
    $performer_id='';
    $member_id='';
    if (!isset($_SESSION)) {
      session_start();
    }
    if (isSet($_SESSION['performer_id']))
    {
        $performer_id=$_SESSION['performer_id'];
    }
    if (isSet($_SESSION['fb_member_id']))
    {
        $member_id=$_SESSION['fb_member_id'];
    }
    $response = array();
    $response["status"] = "info";
    $response["message"] = "performer ".$performer_id.", member ".$member_id;
    if (($performer_id!='') && ($member_id!='')) {
        $db = new DbHandler();
        $result=$db->deleteLink(REL_MEMBER, $member_id, $performer_id);
        $response["status"] = "success";
    }
});

$app->post('/addMember', function() use ($app) {
    $performer_id='';
    $member_id='';
    if (!isset($_SESSION)) {
      session_start();
    }
    if (isSet($_SESSION['performer_id'])) {$performer_id=$_SESSION['performer_id'];}
    if (isSet($_SESSION['fb_member_id'])) {$member_id=$_SESSION['fb_member_id'];}
    $response = array();
    $response["status"] = "info";
    $response["message"] = "performer ".$performer_id.", member ".$member_id;

    if (($performer_id!='') && ($member_id!='')) {
        $db = new DbHandler();
        $result1=$db->insertLink(REL_MEMBER, $member_id, $performer_id);
        $response["status"] = "success";
    }
    echoResponse(200, $response);
});

$app->get('/getMemberList', function() {
    $performer_id='';
    $member_id='';
    if (!isset($_SESSION)) {
      session_start();
    }
    if (isSet($_SESSION['performer_id']))
    {
        $performer_id=$_SESSION['performer_id'];
    }
    $response = array();
    $response["status"] = "info";
    $response["message"] = "No Members Loaded";
    if ($performer_id!='') {
        $db = new DbHandler();
        $qry="select CONVERT(p.fb_id, char) as fb_member_id, p.fb_name, p.fb_photo,";
        $qry.=" case l.fb_relid when ".REL_MEMBER." then 'N' else 'Y' end as fb_owner";
        $qry.=" from fb_person p, fb_link l where l.fb_relid in (".REL_PERFORMER.",".REL_MEMBER.")";
        $qry.=" and l.fb_id2=".$performer_id." and l.fb_id1=p.fb_id";
        $response["memberList"] = $db->getMultiRecords($qry);
        $response["status"] = "success";
        $response["message"] = "Members Loaded";}

    echoResponse(200, $response);
});

$app->get('/searchMembers', function() {
    $performer_id='';
    $member_id='';
    $fb_search='';
    if (!isset($_SESSION)) {
      session_start();
    }
    if (isSet($_SESSION['performer_id'])) {$performer_id=$_SESSION['performer_id'];}
    if (isSet($_SESSION['fb_member_id'])) {$member_id=$_SESSION['fb_member_id'];}
    if (isSet($_SESSION['fb_search'])) {$fb_search=$_SESSION['fb_search'];}
    $response = array();
    $response["status"] = "info";
    $response["message"] = "No Members Loaded";
    if ($performer_id!='') {
        $db = new DbHandler();
        $qry="select p.fb_id as fb_member_id, p.fb_name, p.fb_photo from fb_person p";
        if ($fb_search!='') {
            $qry.=$fb_search;
        }

        $response["memberList"] = $db->getMultiRecords($qry);
        $response["status"] = "success";
        $response["message"] = "Members Loaded";}

    echoResponse(200, $response);
});

$app->post('/searchPerformers', function() use ($app) {

    if (!isset($_SESSION)) {
        session_start();
    }

    $r = json_decode($app->request->getBody());

    $db = new DbHandler();
    $response = array();

    $fb_search = $r->fb_search;

    $response = array();
    $response["status"] = "info";
    $response["message"] = "No Performers Loaded";
    
    $qry  = "select p.fb_id as fb_performer_id, p.fb_name, p.fb_photo, p.fb_type, DATE_FORMAT(p.fb_created,'%d %b %Y') as fb_joinDt, ";
    $qry  .= "IFNULL(pd.fb_strapline,' ') as fb_strapline, IFNULL(pd.fb_descr,' ') as fb_descr, ";
    $qry  .= "(select count(*) from fb_link l, fb_track t where t.fb_id=l.fb_id2 and l.fb_relid=91 and l.fb_id1=p.fb_id) as fb_trackCount, ";
    $qry  .= "(select count(*) from fb_link l, fb_weblinks t where t.fb_id=l.fb_id2 and l.fb_relid=71 and l.fb_id1=p.fb_id) as fb_linkCount ";
    $qry  .= "from fb_performer p left join (select l.fb_id1, d.fb_strapline, d.fb_descr from fb_link l, fb_performerdetail d where l.fb_relid=71 and l.fb_id2=d.fb_id) pd ";
    $qry  .= "ON pd.fb_id1 = p.fb_id ";
    if ($fb_search->searchstr!='') {
        if ($fb_search->type=="Name") {
            $qry.="where p.fb_name = '".$fb_search->searchstr."'";
        }   
    }

    $response["performerList"] = $db->getMultiRecords($qry);
    $response["status"] = "success";
    $response["message"] = $qry;

    echoResponse(200, $response);
});

$app->get('/getTrackList', function() {
    $db = new DbHandler();
    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_id=$_SESSION["performer_id"];
    $response = array();

    $qry="select c.fb_id, c.fb_track_type, c.fb_title, c.fb_url_type, c.fb_track_url, p.fb_photo, p.fb_name";    
    $qry.=" from fb_link l, fb_track c, fb_performer p where l.fb_relid=".REL_PERF_TRACKS." AND l.fb_id1=".$fb_id;
    $qry.=" and c.fb_id=l.fb_id2 and p.fb_id=l.fb_id1";

    $response["fb_trackList"] = $db->getMultiRecords($qry);
    $response["status"] = count($response["fb_trackList"])>0?"success":"info";
    $response["message"] = "Tracks Loaded";

    echoResponse(200, $response);
});

$app->post('/saveTrack', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }

    $fb_id=$_SESSION["performer_id"];
    $rel = REL_PERF_TRACKS;
    $prefix = TRACK_PREFIX;

    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();
    $tabble_name = "fb_track";

//    data:audio/mp3;base64
    $track = $r->fb_track;
    if ($r->fb_track->fb_track_base64!='') {
        $suffix = str_replace('data:audio/','',substr($track->fb_track_base64, 0, strrpos($track->fb_track_base64, ';base64')));
        date_default_timezone_set("Europe/London");
        $filename=AUDIO_REPOSITORY.$prefix.$fb_id.date("Ymdhis").".".$suffix;
        $srcStr = base64_decode(substr($track->fb_track_base64, 1+strrpos($track->fb_track_base64, ',')));
        file_put_contents('../../'.$filename, $srcStr);
        $track->fb_track_url=$filename;
    }
    $column_names = array('fb_title', 'fb_track_type', 'fb_url_type', 'fb_track_url');
    $result = $db->insertIntoTable($track, $column_names, $tabble_name);
    if ($result != NULL) {
      $track_id=$result;
      $result1=$db->insertLink($rel,$fb_id,$track_id);}

    $response["status"] = "success";
    $response["message"] = "Track saved ";
    echoResponse(200, $response);
});

$app->post('/removeTrack', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }

    $fb_id=$_SESSION["performer_id"];
    $rel = REL_PERF_TRACKS;

    $response = array();
    $r = json_decode($app->request->getBody());
    $db = new DbHandler();

    if (file_exists('../../'.$r->fb_track->fb_track_url)) {
        unlink('../../'.$r->fb_track->fb_track_url);}
    $qry = "delete from fb_track where fb_id=".$r->fb_track->fb_id;
    $db->execSQL($qry);
    $qry = "delete from fb_link where fb_relid=".$rel." and fb_id1=".$fb_id." and fb_id2=".$r->fb_track->fb_id;
    $db->execSQL($qry);

    $response["status"] = "success";
    $response["message"] = "Track deleted";
    echoResponse(200, $response);
});

$app->post('/saveNewsItem', function() use ($app) {

    if (!isset($_SESSION)) {
        session_start();
    }
    $fb_pid = 0;
    $r = json_decode($app->request->getBody());
    if (isset($_SESSION["fb_id"])) {
        $fb_pid=$_SESSION["performer_id"];
        $response = array();
        $db = new DbHandler();
        if ($r->fb_news->news_id <= 0) {

            $query = "INSERT INTO fb_newsitem (fb_date, fb_type, fb_headline, fb_link, fb_descr, fb_photo, fb_updater_id) ";
            $query .= " VALUES (";
            $query .=  "'".substr($r->fb_news->fb_date,0,10)."', ";
            $query .=  "'".$r->fb_news->fb_type."', ";
            $query .=  "'".$r->fb_news->fb_headline."', ";
            $query .=  "'".$r->fb_news->fb_link."', ";
            $query .=  "'".$r->fb_news->fb_descr."', ";
            $query .=  "'".$r->fb_news->fb_photo."', ";
            $query .=  $r->fb_news->fb_updater_id.")";
            $news_id = $db->execSQL($query);
            if ($news_id != NULL) {
                $result1=$db->insertLink(REL_NEWS_ITEM,$fb_pid,$news_id);

                $response["news_id"] =  $news_id;
                $response["status"] = "success";
                $response["message"] = "News Item created";
            }
            else {
                $response["status"] = "error";
                $response["message"] = "Error saving news item.";
            }
        }
        else {
            $query = "UPDATE fb_newsitem SET fb_date = '".substr($r->fb_news->fb_date,0,10)."', ";
            $query .=  "fb_type = '".$r->fb_news->fb_type."', ";
            $query .=  "fb_headline = '".$r->fb_news->fb_headline."', ";
            $query .=  "fb_link = '".$r->fb_news->fb_link."', ";
            $query .=  "fb_descr = '".$r->fb_news->fb_descr."', ";
            $query .=  "fb_photo = '".$r->fb_news->fb_photo."', ";
            $query .=  "fb_updater_id = ".$r->fb_news->fb_updater_id.", ";
            $query .=  "fb_updated = now() ";
            $query .=  "WHERE fb_id = ".$r->fb_news->news_id;
            $news_id = $db->execSQL($query);
            $response["status"] = "success";
            $response["message"] = "News Item updated";
        }
    }
    else {
        $response["status"] = "error";
        $response["message"] = "Sorry, we were unable to process your request. Please sign in or sign up as a Fanbase member.";
    }
    echoResponse(200, $response);
});

$app->post('/getNewsItem', function() use ($app) {

    if (!isset($_SESSION)) {
        session_start();
    }
    $r = json_decode($app->request->getBody());

    $db = new DbHandler();
    $response = array();

    $qry="select fb_id, fb_date, fb_type, fb_headline, fb_link, fb_descr, fb_photo";    
    $qry.=" from fb_newsitem where fb_id=".$r->fb_news_id;

    $response["news"] = $db->getOneRecord($qry);
    $response["status"] = "success";
    $response["message"] = "News item loaded";

    echoResponse(200, $response);
});

$app->post('/listNewsItems', function() use ($app) {

    if (!isset($_SESSION)) {
        session_start();
    }
    $r = json_decode($app->request->getBody());

    $db = new DbHandler();
    $response = array();

    $qry="select n.fb_id, n.fb_date, n.fb_type, n.fb_headline, n.fb_link, n.fb_descr, n.fb_photo ";    
    $qry.="from fb_link l, fb_newsitem n WHERE l.fb_relid=111 and l.fb_id1=".$r->fb_performer_id." and n.fb_id=l.fb_id2 order by n.fb_created desc";

    $response["newsList"] = $db->getMultiRecords($qry);
    $response["status"] = "success";
    $response["message"] = "News item list loaded";

    echoResponse(200, $response);
});


$app->post('/saveBooking', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }
    if (isset($_SESSION["fb_id"])) {
        $fb_id=$_SESSION["fb_id"];
        $r = json_decode($app->request->getBody());
        $fb_pid=$r->fb_booking->performer_id;
        
        $response = array();
        $db = new DbHandler();
        
        $query = "INSERT INTO fb_booking (fb_date, fb_type, fb_descr, fb_contact_name, fb_contact_detail, fb_link) ";
        $query .= " VALUES (";
        $query .=  "'".substr($r->fb_booking->fb_date,0,10)."', ";
        $query .=  "'".$r->fb_booking->fb_type."', ";
        $query .=  "'".$r->fb_booking->fb_descr."', ";
        $query .=  "'".$r->fb_booking->fb_contact_name."', ";
        $query .=  "'".$r->fb_booking->fb_contact_detail."', ";
        $query .=  "'".$r->fb_booking->fb_link."') ";
        $booking_id = $db->execSQL($query);
        if ($booking_id != NULL) {
            $result1=$db->insertLink(REL_PERF_BOOKING,$fb_pid,$booking_id);
            $result2=$db->insertLink(REL_BOOKING,$fb_id,$booking_id);
            
            $response["booking_id"] =  $booking_id;
            $response["status"] = "success";
            $response["message"] = "Thankyou for your inquiry, a Fanbase agent will contact you very soon.";
        }
        else {
            $response["status"] = "error";
            $response["message"] = "Error saving news item.";
        }
    }
    else {
        $response["status"] = "error";
        $response["message"] = "Sorry, we were unable to process your request. Please sign in or sign up as a Fanbase member.";
    }
    echoResponse(200, $response);
});

$app->get('/initBooking', function() use ($app) {
    if (!isset($_SESSION)) {
        session_start();
    }    
    if (isset($_SESSION["fb_id"])) {
        $fb_id=$_SESSION["fb_id"];
        $response = array();
        $db = new DbHandler();
/*        
        $qry="select b.fb_type, b.fb_contact_name, b.fb_contact_detail, b.fb_descr, b.fb_link ";
        $qry.="from fb_link l, fb_booking b WHERE l.fb_relid=".REL_BOOKING." and l.fb_id1=".$fb_id." and b.fb_id=l.fb_id2 order by b.fb_created desc";
        $booking = $db->getOneRecord($qry);

        if ($booking==NULL) {
*/
            $qry="select c.fb_id, c.fb_contact_type, c.fb_contact_detail";    
            $qry.=" from fb_link l, fb_contact c where l.fb_relid=".REL_CONTACT." AND l.fb_id1=".$fb_id;
            $qry.=" and c.fb_id=l.fb_id2";
        
            $contactList = $db->getMultiRecords($qry);
            $det = "";
            foreach($contactList as $contact) {
                if ($det!="") $det.=" OR ";
                $det.=$contact["fb_contact_type"].": ".$contact["fb_contact_detail"];
            }

            $qry="select i.fb_id, i.fb_alias, i.fb_title, i.fb_name_first, i.fb_name_middle, i.fb_name_last, i.fb_gender, i.fb_birth_date";    
            $qry.=" from fb_link l, fb_identity i where l.fb_relid=".REL_IDENTITY." AND l.fb_id1=".$fb_id;
            $qry.=" and i.fb_id=l.fb_id2";

            $ident = $db->getOneRecord($qry);
            $name = "";
            if ($ident!=NULL) {
                $name = strlen($ident["fb_title"])>0?$ident["fb_title"]." ":"";
                $name .= strlen($ident["fb_name_first"])>0?$ident["fb_name_first"]." ":"";
                $name .= strlen($ident["fb_name_middle"])>0?$ident["fb_name_middle"]." ":"";
                $name .= strlen($ident["fb_name_last"])>0?$ident["fb_name_last"]." ":"";
            }

        $response["fb_contact_detail"] = $det;
        $response["fb_contact_name"] = $name;
        $response["status"] = "success";
        $response["message"] = "Booking initialised";
    } else {
        $response["status"] = "error";
        $response["message"] = "Not logged in - please sign into Fanbase to make a booking inquiry";
    }
    echoResponse(200, $response);
});    

?>