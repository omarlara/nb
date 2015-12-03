<?php

$response = array();

$response["result"] = true;

$response["numbers"] = array(20,21,22,24,25,26,27,28,29);

$response["elements"] = array();

$obj = array(
    "value" => "new place st",
    "name" => "New Place St"
);

array_push($response["elements"], (object)$obj);

$obj = array(
    "value" => "fake place st",
    "name" => "Fake Place St"
);

array_push($response["elements"], (object)$obj);
$obj = array(
    "value" => "",
    "name" => "No one above"
);

array_push($response["elements"], (object)$obj);

echo json_encode($response);
