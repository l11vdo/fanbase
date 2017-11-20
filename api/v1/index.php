<?php

require_once 'dbHandler.php';
require_once 'passwordHash.php';
require '.././libs/Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

// User id from db - Global Variable
$user_id = NULL;

include_once '../config.php';
include_once 'appconfig.php';
require_once 'fanbase.php';

/**
 * Verifying required params posted or not
 */
function verifyRequiredParams($required_fields,$request_params) {
    $error = false;
    $error_fields = "";
    foreach ($required_fields as $field) {
        if (!isset($request_params->$field) || strlen(trim($request_params->$field)) <= 0) {
            $error = true;
            $error_fields .= $field . ', ';
        }
    }

    if ($error) {
        // Required field(s) are missing or empty
        // echo error json and stop the app
        $response = array();
        $app = \Slim\Slim::getInstance();
        $response["status"] = "error";
        $response["message"] = 'Required field(s) ' . substr($error_fields, 0, -2) . ' is missing or empty';
        echoResponse(200, $response);
        $app->stop();
    }
}


function echoResponse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json');

    echo json_encode($response);
}

function check_status($jsondata) {
    if ($jsondata["status"] == "OK") return true;
    return false;
}
function google_getProvince($jsondata) {
    return Find_Long_Name_Given_Type("administrative_area_level_2", $jsondata["results"][0]["address_components"], true);
}
function google_getCity($jsondata) {
    return Find_Long_Name_Given_Type("locality", $jsondata["results"][0]["address_components"]);
}
function google_getStreet($jsondata) {
    return Find_Long_Name_Given_Type("route", $jsondata["results"][0]["address_components"]);
}
function google_getPostalCode($jsondata) {
    return Find_Long_Name_Given_Type("postal_code", $jsondata["results"][0]["address_components"]);
}
function google_getCountryCode($jsondata) {
    return Find_Long_Name_Given_Type("country", $jsondata["results"][0]["address_components"], true);

}function google_getCountry($jsondata) {
    return Find_Long_Name_Given_Type("country", $jsondata["results"][0]["address_components"]);
}

function google_getAddress($jsondata) {
    return $jsondata["results"][0]["formatted_address"];
}

function formatted_address($house_nr, $jsondata) {
    $addr = $house_nr . " " . google_getStreet($jsondata);

    if (google_getCity($jsondata)!="") {$addr .= "\n" . google_getCity($jsondata);}
    if (google_getProvince($jsondata)!="") {$addr .= "\n" . google_getProvince($jsondata);}
    if (google_getPostalCode($jsondata)!="") {$addr .= "\n" . google_getPostalCode($jsondata);}
    if (google_getCountry($jsondata)!="") {$addr .= "\n" . google_getCountry($jsondata);}

    return $addr;
}

/*
* Searching in Google Geo json, return the long name given the type. 
* (If short_name is true, return short name)
*/

function Find_Long_Name_Given_Type($type, $array, $short_name = false) {
    foreach( $array as $value) {
        if (in_array($type, $value["types"])) {
            if ($short_name)    
                return $value["short_name"];
            return $value["long_name"];
        }
    }
}

function Find_All_Streets($jsondata) {
    $streets = array();
    for ($i = 0; $i < count($jsondata["results"]); $i++) {
        $array=$jsondata["results"][$i]["address_components"];
        $street_name=Find_Long_Name_Given_Type("route", $array, false);
        if ($street_name && !in_array($street_name,$streets)){
            array_push($streets, $street_name);
        }
    }
    return $streets;
}

$app->run();
?>
