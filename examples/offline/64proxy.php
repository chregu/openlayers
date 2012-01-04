<?php

$src = $_GET['src'];

if (strpos($src,'http://tile.openstreetmap.org/') === 0  && preg_match("/^[:a-z\.0-9\/]+$/",$src)) {
    $data = file_get_contents($src);
    print "data:image/jpeg;base64,".base64_encode($data);
} else {
    header("HTTP/1.1 403 Forbidden");
    print "NOT ALLOWED AND FORBIDDEN";
}



