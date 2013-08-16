<?php


class auth
{

  /*
  #
  #	Log a user in
  #
  */
  function log_in($params)
  {
  	global $db_mysql, $db_auth, $app;

  	$db_mysql->connect($app['db_host'], $params['db_username'], $params['db_password'], 'mysql');
  	if($db_mysql->is_connected())
  	{
  		$db_auth->log_in($params['db_username'], $params['db_password']);

  		return format_response
  		(
  			array
  			(
  				'logged_in' => true
  			)
  		);
  	}
  }


  /*
  #
  #	Destroy user session
  #
  */
  function log_out()
  {
  	global $db_auth;

  	$db_auth->log_out();

    return format_response
      (
        array
        (
          'logged_in' => false
        )
      );
  }


}