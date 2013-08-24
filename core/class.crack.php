<?php


class crack
{

	public $base_url = false;
	public $vars = false;


	//
	//	Fetch the vars and base url, could just use http_host and request_uri but
	// 	this gives it to us even when at a folder level so it's kinda nice
	//
	function __construct()
	{
		$self = explode('/', $_SERVER['PHP_SELF']);
		$base_url = $_SERVER['SERVER_NAME'];
		
		do
		{
			$piece = array_shift($self);
			if($piece != '' && $piece != 'index.php')
			{
				$base_url .= '/' . $piece;
			}
		}while($piece != 'index.php');
		
		$this->vars = $self;
		$this->base_url = 'http://' . $base_url . '/';

		// clean each var
		foreach($this->vars as $key => $var)
		{
			$this->vars[$key] = clean($this->vars[$key]);
		}
	}

	
	//
	//	Returns the site config details
	//
	function get_details()
	{
		global $config, $environment;
		$server_name = $_SERVER['SERVER_NAME'];
		
		// merge environment settings into the default config
		if(isset($environment[$server_name]))
		{
			$config = array_merge($config, $environment[$server_name]);
		}
		
		// add base url(if auto) and vars
		$config['base_url'] = $config['base_url'] === 'auto' ? $this->base_url : $config['base_url'];
		$config['vars'] = $this->vars;

		return $config;
	}

}


?>