<?php
$data = json_decode(file_get_contents("php://input"));
$path = $data->path;

$APIkey = 'AIzaSyBN1-Hg_a6druhVmlX_bVLKpbTNcoGQnMc';
$blogId = '4103557224482300203';


$query = 'https://www.googleapis.com/blogger/v3/blogs/'.$blogId.'/'.$path.'?key='. $APIkey;
$response = file_get_contents($query);
echo($response);
?>
