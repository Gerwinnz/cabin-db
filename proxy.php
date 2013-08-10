<?php


// Set your return content type
header('Content-type: audio/ogg,mp3');

// Website url to open
$daurl = $_GET['url'];

// Get that website's content
$handle = fopen($daurl, "r");

// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}


?>