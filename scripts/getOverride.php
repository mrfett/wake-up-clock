<?php
	$filename = "../files/mode.txt";
	/*
	$handle = fopen($filename);
	if ($handle) {echo "file opened: " . $handle;}
	$mode = fread($handle, filesize($filename));
	fclose($handle);
	*/
	$mode = NULL;
	
	$mode = file_get_contents($filename);
	
	if ($mode==FALSE) {
		echo 'null';
	} else {
		echo $mode;
	}
?>