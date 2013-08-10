<?php

class assets
{

	//
	//	Store all the paths in these class vars
	//
	private $scripts = array();
	private $styles = array();
	private $inline_script = '';

	//
	//	Add script methods
	//
	function add_script($path)
	{
		global $app;

		$pieces = explode('/', $path);
		if($pieces[0] != 'http:' && $pieces[0] != 'https:')
		{
			if($pieces[0] == 'addons')
			{
				$path = $app['base_url'] . '/addons/assets/js/' . $pieces[1] . '.js';
			}
			else
			{
				$path = $app['base_url'] . ASSETS_URL . '/js/' . $path . '.js';	
			}
		}

		$this->scripts[] = $path;
	}

	function add_scripts($path)
	{
		global $app;

		$link_path = '';
		$pieces = explode('/', $path);

		if($pieces[0] == 'addons')
		{
			$path = str_replace('addons/', '', $path);
			$link_path = $app['base_url'] . '/addons/assets/js/' . $path . '/';
			$files = scandir(BASE . '/addons/assets/js/' . $path . '/');
		}
		else
		{
			$link_path = $app['base_url'] . ASSETS_URL.'/js/' . $path . '/';
			$files = scandir(ASSETS . '/js/' . $path . '/');
		}
		
		foreach($files as $file)
		{
			$bits = explode('.', $file);
			if(array_pop($bits) == 'js')
			{
				$this->scripts[] = $link_path . $file;
			}
		}
	}



	//
	//	Add style methods
	//
	function add_style($path)
	{
		global $app;

		$pieces = explode('/', $path);
		if($pieces[0] != 'http:' && $pieces[0] != 'https:')
		{
			if($pieces[0] == 'addons')
			{
				$path = $app['base_url'] . '/addons/assets/css/' . $pieces[1] . '.css';
			}
			else
			{
				$path = $app['base_url'] . ASSETS_URL . '/css/' . $path . '.css';
			}
		}

		$this->styles[] = $path;
	}

	function add_styles($path)
	{
		global $app;

		$link_path = '';
		$pieces = explode('/', $path);

		if($pieces[0] == 'addons')
		{
			$path = str_replace('addons/', '', $path);
			$link_path = $app['base_url'] . '/addons/assets/css/' . $path . '/';
			$files = scandir(BASE . '/addons/assets/css/' . $path . '/');
		}
		else
		{
			$link_path = $app['base_url'] . ASSETS_URL . '/css/' . $path . '/';
			$files = scandir(ASSETS . '/css/' . $path . '/');
		}
		
		foreach($files as $file)
		{
			$bits = explode('.', $file);
			if(array_pop($bits) == 'css')
			{
				$this->styles[] = $link_path . $file;
			}
		}
	}

	//
	//	Inject custom bit of js in
	//
	function inject_script($script)
	{
		$this->inline_script .= $script;
	}

	

	
	//
	//	Returns the script and style outputs
	//
	function get_scripts()
	{
		$scripts = '';
		foreach($this->scripts as $index=>$path)
		{
			$scripts .= '<script type="text/javascript" src="'.$path.'"></script>';
		}

		if($this->inline_script != '')
		{
			$scripts .= '<script type="text/javascript">'.$this->inline_script.'</script>';
		}

		return $scripts;
	}

	function get_styles()
	{
		$styles = '';
		foreach($this->styles as $index=>$path)
		{
			$styles .= '<link href="'.$path.'" rel="stylesheet" type="text/css" />';
		}

		return $styles;
	}
}

?>