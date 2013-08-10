<?php

	session_start();

	//
	//	Define constants
	//
	define('CRACK', 1);
	define('BASE', dirname(__FILE__));

	define('CORE', BASE.'/core');
	define('DB', BASE.'/db');
	define('ROCKS', BASE.'/rocks');
	define('APP', BASE.'/app');
	define('ADDONS', BASE.'/addons');
	define('STARTUP', BASE.'/app/startup');

	define('ASSETS', BASE.'/app/assets');
  define('ASSETS_URL', '/app/assets');
  define('MODELS', BASE.'/app/models');
  define('VIEWS', BASE.'/app/views');
  define('CONTROLLERS', BASE.'/app/controllers');
  define('LAYOUTS', BASE.'/app/layouts');
  
	//
	//	Include init
	//
	include_once('config.php');
	include_once('init.php');
	


	//
	//	Call display
	//
	$display = new display();
	echo $display->render();
	
	//echo '<pre style="font-size:11px;">'.print_r($_SERVER, true).'</pre>';

?>