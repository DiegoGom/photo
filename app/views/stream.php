<?php
	foreach (glob("media/*.gif") as $filename) {
    	echo '<li><a href="#" data-url="'.base_url($filename).'"><img class="shadow round" src="'.base_url($filename).'"></a></li>';
	}
?>