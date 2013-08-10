<?php

class output
{

	private $model = array();
	private $vars = array();


	//
	//	Sets a value to a output variable
	//
	function set($name, $value)
	{
		$name = explode('.', $name);
		
		if(sizeof($name) > 1)
		{
			$this->vars[$name[0]][$name[1]] = $value;
		}
		else
		{
			$this->vars[$name[0]] = $value;
		}
	}
	
	//
	//	Returns all the output
	//
	function get()
	{
		return $this->vars;
	}

	//
	//	Concats a value to a output variable
	//
	function add($name, $value)
	{
		$name = explode('.', $name);
		if(sizeof($name) > 1)
		{
			$this->vars[$name[0]][$name[1]] .= $value;
		}
		else
		{
			$this->vars[$name[0]] .= $value;
		}
	}

}


?>