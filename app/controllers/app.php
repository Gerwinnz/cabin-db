<?php


class app
{


  //
  //  Set layout
  //
  function __construct()
  {
    global $app, $config, $db_mysql, $db_auth;

    //$db_auth->log_out();
    if(isset($_REQUEST['db_name']))
    {
      $db_mysql->connect($app['db_host'], $db_auth->get('username'), $db_auth->get('password'), $_REQUEST['db_name']);
    }
    elseif($db_auth->logged_in())
    {
      $db_mysql->connect($app['db_host'], $db_auth->get('username'), $db_auth->get('password'), 'mysql');
    }
  }

  
  
  //
  //  Default end point for controller, renders our page layout etc on arrival
  //
  function index()
  {
    global $db, $output, $app;

    layout('cabin');
    
    $output->set('state', $this->get_state());
    $output->set('base_url', $app['base_url']);

    return view('db_schema/index');
  }



  //
  //  Generates a json string of the current logged in state
  //
  function get_state()
  {
    global $db_auth;

    $state = array();
    $state['current_user'] = $db_auth->logged_in();

    if($state['current_user'])
    {
      $state['databases'] = query('SHOW DATABASES');
    }

    return json_encode($state);
  }


}