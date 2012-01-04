<?php

$src = $_GET['src'];
/*var_dump($src);
die();*/
$data = file_get_contents($src);
print "data:image/jpeg;base64,".base64_encode($data);


