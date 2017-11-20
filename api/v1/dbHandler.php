<?php

class DbHandler {

    private $conn;

    function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }
    /**
     * Fetching single record
     */
    public function getOneRecord($query) {
        $r = $this->conn->query($query.' LIMIT 1') or die($this->conn->error.__LINE__);
        return $result = $r->fetch_assoc();    
    }
    /**
     * Fetching multiple record
     */
    public function getMultiRecords($query) {
       $result = array();
       $r = $this->conn->query($query) or die($this->conn->error.__LINE__);
       while ($row = $r->fetch_assoc())
       { 
           $result[]=$row;
       }
       return $result;
    }
    /**
     * Creating new record
     */
    public function insertIntoTable($obj, $column_names, $table_name) {
        
        $c = (array) $obj;
        $keys = array_keys($c);
        $columns = '';
        $values = '';
        foreach($column_names as $desired_key){ // Check the obj received. If blank insert blank into the array.
           if(!in_array($desired_key, $keys)) {
                $$desired_key = '';
            }else{
                $$desired_key = $c[$desired_key];
            }
            $columns = $columns.$desired_key.',';
            $values = $values."'".$$desired_key."',";
        }
        $query = "INSERT INTO ".$table_name."(".trim($columns,',').") VALUES(".trim($values,',').")";
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
            } else {
            return NULL;
        }
    }

    /**
     * Insert a link record
     */
    public function insertLink($relid, $id1, $id2) {
        
        $query = "INSERT INTO fb_link (fb_relid, fb_id1, fb_id2) VALUES (";
        $query .= $relid . ",";
        $query .= $id1 . ",";
        $query .= $id2 . ")";

        return $this->conn->query($query) or die($this->conn->error.__LINE__);
    }

    /**
     * Delete a link record
     */
    public function deleteLink($relid, $id1, $id2) {
        
        $query = "DELETE FROM fb_link WHERE fb_relid=" . $relid;
        $query .= " AND fb_id1=" . $id1;
        $query .= " AND fb_id2=" . $id2;

        return $this->conn->query($query) or die($this->conn->error.__LINE__);
    }
    /**
     * Delete a record with fb_id primary key
     */
    public function deleteRecord($fbid, $table_name) {
        
        $query = "DELETE FROM `".$table_name."` WHERE fb_id=".$fbid;

        return $this->conn->query($query) or die($this->conn->error.__LINE__);
    }
    
    /**
     * Delete a record with fb_id primary key
     */
    public function execSQL($fb_sql) {
        $r = $this->conn->query($fb_sql) or die($this->conn->error.__LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
            } else {
            return NULL;
        }
    }
    
    public function getSession(){
    $sess["fb_id"] = '';
    $sess["fb_name"] = '';
    $sess["fb_photo"] = '';
    $sess["fb_performer_id"] = '';

    if (!isset($_SESSION)) {
        session_start();
    }
    $sess = array();

    if (isset($_SESSION['fb_id'])) {$sess["fb_id"] = $_SESSION['fb_id'];}
    if (isset($_SESSION['fb_name'])) {$sess["fb_name"] = $_SESSION['fb_name'];}
    if (isset($_SESSION['fb_photo'])) {$sess["fb_photo"] = $_SESSION['fb_photo'];}
    if (isSet($_SESSION['fb_performer_id'])) {$sess["fb_performer_id"] = $_SESSION['fb_performer_id'];}

    return $sess;
    }
    
    public function destroySession(){
    if (!isset($_SESSION)) {
        session_start();
    }
    if (isSet($_SESSION['fb_id'])) {unset($_SESSION['fb_id']);}
    if (isSet($_SESSION['performer_id'])) {unset($_SESSION['performer_id']);}
    if (isset($_SESSION['fb_name'])) {unset($_SESSION['fb_name']);}
    if (isset($_SESSION['fb_photo'])) {unset($_SESSION['fb_photo']);}

    $info='info';
    if(isSet($_COOKIE[$info])) setcookie ($info, '', time() - $cookie_time);

    $msg="Logged Out Successfully. Thankyou for checking out Fanbase - please come back soon.";

    return $msg;
    }
}
?>
