<?php


//
//	Include core
//
include_once('core/Twig/Autoloader.php');
include_once('core/class.cabin.php');
include_once('core/class.output.php');
include_once('core/class.assets.php');
include_once('core/class.display.php');
include_once('core/class.routes.php');

include_once('core/func.core.php');
include_once('core/func.display.php');




//
//	Define globals
//
$cabin = new cabin();
$app = $cabin->get_details();
$vars = $app['vars'];
$base_route = '';

// Output
$output = new output();
$assets = new assets();
$layout = 'default';

// Start twig template engine
Twig_Autoloader::register();
$loader = new Twig_Loader_String();
$twig = new Twig_Environment($loader, array('autoescape'=>false));
$twig->addGlobal('assets', $assets);



//
//	Startup
//
if(isset($app['startup']))
{
	foreach($app['startup'] as $live_class)
	{
		include_once(STARTUP.'/'.$live_class.'.php');
		$$live_class = new $live_class();
	}
}



?>