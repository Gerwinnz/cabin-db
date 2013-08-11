<?php

class db_auth
{

	private $current_user = array();


	//
	//	Setter and getters
	//
	function get($param = '')
	{
		return $this->current_user[$param];
	}

	function set($params = array(), $value = false)
	{
		if(is_array($params))
		{
			foreach($params as $param=>$val)
			{
				$this->current_user[$param]	= $val;
			}
		}
		else
		{
			$this->current_user[$params] = $value;
		}

		$_SESSION['current_user'] = $this->current_user;
	}


	//
	//	On construct we check for submitted form fields and set
	// 	any twig vars such as current_user and logged_in boolean
	//
	function __construct()
	{
		global $twig, $app;


		// check for submitted details and log the user in
		if(isset($_POST['user_username'], $_POST['user_password']))
		{
			$this->login($_POST['user_username'], $_POST['user_password']);
		}

		// check for logged in and set twig variables
		if($current_user = $this->logged_in())
		{
			$twig->addGlobal('logged_in', true);
			$twig->addGlobal('current_user', $current_user);
		}
		else
		{
			$twig->addGlobal('logged_in', false);
		}

		// set the current user
		$this->current_user = $current_user;
	}


	//
	//	Creates a user session
	//
	function log_in($username, $password)
	{
		global $twig;

		
	}


	//
	//	Destroy current user session
	//
	function log_out()
	{
		unset($_SESSION['current_user']);
	}


	//
	//	Return true/false for logged in status
	//
	function logged_in()
	{
		if(isset($_SESSION['current_user']))
		{
			return $_SESSION['current_user'];
		}

		return false;
	}

}

?>