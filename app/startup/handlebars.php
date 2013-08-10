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


	function add_templates($path)
	{
		$full_path = ASSETS . '/js/' . $path;
		$files = scandir($full_path);
		
		foreach($files as $file_name)
		{
			$bits = explode('.', $file_name);
			if(array_pop($bits) == 'html')
			{
				$file_path = $path . '/' . implode($bits, '.');
				$this->compile_template($file_path);
			}
		}
	}

	function add_template($path)
	{
		$this->compile_template($path);
	}

	function compile_template($file_path)
	{
		global $assets;
		
		if(is_file(ASSETS . '/js/' . $file_path . '.html'))
		{
			$template = addslashes(file_get_contents(ASSETS . '/js/' . $file_path . '.html'));
			$template = str_replace(array("\r\n", "\n"), '', $template);
			
			$assets->inject_script("templates['" . $file_path . "'] = Handlebars.compile('".$template."');");
		}
	}

}

?>