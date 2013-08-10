<?php

class handlebars
{

	//
	//
	//
	function __construct()
	{
		global $twig, $assets;
		$twig->addGlobal('handlebars', $this);
		$assets->inject_script('var templates = {};');
	}


	function add_template($path)
	{
		global $assets;

		$fullPath = ASSETS . '/js/' . $path . '.html';
		if(is_file($fullPath))
		{
			$template = addslashes(file_get_contents($fullPath));
			$template = str_replace(array("\r\n", "\n"), '', $template);
			
			$assets->inject_script("templates['" . $path . "'] = Handlebars.compile('".$template."');");
		}
	}

}

?>