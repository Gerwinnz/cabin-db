<?php


class db_users
{

  /*
  #
  # Connect to our db
  #
  */
  function __construct()
  {
    global $app, $db_mysql, $db_auth;
    
    $db_mysql->connect($app['db_host'], $db_auth->get('username'), $db_auth->get('password'), 'mysql');
  }



  /*
  #
  # Returns list of users with global privileges and privileges to the current database
  #
  */
  function get($params)
  {
    $users = array();

    // Select db specific users, check for escaped underscores in db col
    $sql = "SELECT USER, HOST FROM mysql.db WHERE db = '" . $params['db_name'] . "' OR db = '" . str_replace('_', '\_', $params['db_name']) . "'";
    $result = query($sql);

    if(isset($result['error']))
    {
      return format_response($result['error'], 'error');
    }

    $users = $result['rows'];

    // Select users with global privileges 
    $sql = 
    "
      SELECT USER, HOST 
      FROM mysql.user 
      WHERE 
      select_priv = 'Y' OR insert_priv = 'Y' OR update_priv = 'Y' OR delete_priv = 'Y' OR create_priv = 'Y' OR drop_priv = 'Y' OR 
      reload_priv = 'Y' OR shutdown_priv = 'Y' OR process_priv = 'Y' OR file_priv = 'Y' OR grant_priv = 'Y' OR references_priv = 'Y' OR 
      index_priv = 'Y' OR alter_priv = 'Y' OR show_db_priv = 'Y' OR super_priv = 'Y' OR create_tmp_table_priv = 'Y' OR 
      lock_tables_priv = 'Y' OR execute_priv = 'Y' OR repl_slave_priv = 'Y' OR repl_client_priv = 'Y' OR create_view_priv = 'Y' OR 
      show_view_priv = 'Y' OR create_routine_priv = 'Y' OR alter_routine_priv = 'Y' OR create_user_priv = 'Y' OR event_priv = 'Y' OR 
      trigger_priv = 'Y'
    ";

    $result = query($sql);
    $global_users = $result['rows'];

    // add global users to users array if not already in there
    foreach($global_users as $global_user)
    {
      // loop through users and see if they exist
      $exists = false;
      foreach($users as $user)
      {
        if($global_user == $user)
        {
          $exists = true;
        }
      }

      // add to users if they don't exist
      if(!$exists)
      {
        array_push($users, $global_user);
      }
    }
  
    return format_response($users);
  }





  /*
  #
  # Returns a list of all the users
  #
  */
  function get_existing_users($params)
  {
    $result = query("SELECT * FROM mysql.user");
    $existing_users = $result['rows'];

    return format_response($existing_users);
  }





  /*
  #
  # Creates a new user with privileges to the current db
  #
  */
  function add_user($params)
  {
    $result = query("CREATE USER '" . $params['user_name'] . "'@'" . $params['host'] . "' IDENTIFIED BY  '" . $params['password'] . "'");
    if(isset($result['error']))
    {
      return format_response($result['error'], 'error');
    }
    

    $result = query("GRANT ALL PRIVILEGES ON  `" . $params['db_name'] . "` . * TO  '" . $params['user_name'] . "'@'" . $params['host'] . "' WITH GRANT OPTION");
    if(isset($result['error']))
    {
      return format_response($result['error'], 'error');
    }
    
    return $this->get($params);
  }




  /*
  #
  # Change a user's password
  # 
  */
  function save_user_options($params)
  {
    $result =  query("SET PASSWORD FOR '" . $params['user_name'] . "'@'" . $params['host'] . "' = PASSWORD('" . $params['password'] . "')");
    if(isset($result['error']))
    {
      return format_response($result['error'], 'error');
    }
    else
    {
      return format_response('Password changed for \'' . $params['user_name'] . '\'@\'' . $params['host'] . '\'.');
    }
  }





  /*
  #
  # Drops specified user
  #
  */
  function drop_user($params)
  {
    $result = query("DROP USER '" . $params['user_name'] . "'@'" . $params['host'] . "'");
    if(isset($result['error']))
    {
      return format_response($result['error'], 'error');
    }

    return $this->get($params);
  }



  


  /*
  #
  # Returns a specific users global privileges
  #
  */
  function get_global_privileges($params)
  {
    $result = query("SELECT * FROM mysql.user WHERE user = '" . $params['user_name'] . "' AND host = '" . $params['host'] . "'");
    $global_privileges = $result['rows'][0];

    return format_response($global_privileges);
  }




  /*
  #
  # Returns a specific users database privileges
  #
  */
  function get_database_privileges($params)
  {
    $result = query("SELECT * FROM mysql.db WHERE user = '" . $params['user_name'] . "' AND host = '" . $params['host'] . "'");
    $specific_privileges = $result['rows'];

    return format_response($specific_privileges);
  }




  /*
  #
  # Saves privileges for a specific database and user
  #
  */
  function save_privileges($params)
  {
    query("REVOKE ALL PRIVILEGES ON  `" . $params['db_name'] . "` . * FROM  '" . $params['user_name'] . "'@'" . $params['host'] . "'");
    query("REVOKE GRANT OPTION ON  `" . $params['db_name'] . "` . * FROM  '" . $params['user_name'] . "'@'" . $params['host'] . "'");
    
    // get from params the privileges
    $grants = $this->resolve_privileges($params);

    // compile the sql statement    
    $sql = "GRANT " . implode(', ', $grants) . " ON `" . $params['db_name'] . "`.* TO '" . $params['user_name'] ."'@'" . $params['host'] . "'";
    if($params['grant_priv'] == 'true')
    { 
      $sql .= ' WITH GRANT OPTION';
    }

    // execute
    $result = query($sql);

    // return 
    if(isset($result['error']))
    {
      return format_response($result['error'], 'error');
    }
    else
    {
      return $this->get_database_privileges($params);
    }
  }


  /*
  #
  # Saves privileges for a specific database and user
  #
  */
  function save_global_privileges($params)
  {
    query("REVOKE ALL PRIVILEGES ON *.* FROM '" . $params['user_name'] . "'@'" . $params['host'] . "'");
    query("REVOKE GRANT OPTION ON *.* FROM  '" . $params['user_name'] . "'@'" . $params['host'] . "'");

    // get the grants from the params
    $grants = $this->resolve_privileges($params);

    // compile the sql statement    
    $sql = "GRANT " . implode(', ', $grants) . " ON *.* TO '" . $params['user_name'] ."'@'" . $params['host'] . "'";
    if($params['grant_priv'] == 'true')
    { 
      $sql .= ' WITH GRANT OPTION ';
    }
    $sql .= "MAX_QUERIES_PER_HOUR " . $params['MAX_QUERIES_PER_HOUR'] . " ";
    $sql .= "MAX_CONNECTIONS_PER_HOUR " . $params['MAX_CONNECTIONS_PER_HOUR'] . " "; 
    $sql .= "MAX_UPDATES_PER_HOUR " . $params['MAX_UPDATES_PER_HOUR'] . " "; 
    $sql .= "MAX_USER_CONNECTIONS " . $params['MAX_USER_CONNECTIONS'];

    // execute
    $result = query($sql);

    // return 
    if(isset($result['error']))
    {
      return format_response($result['error'], 'error');
    }
    else
    {
      return $this->get_database_privileges($params);
    }
  }



  function resolve_privileges($params)
  {
    $grant = array();

    // Data
    if($this->has_priv($params, 'select_priv')){ $grant[] = 'SELECT'; }
    if($this->has_priv($params, 'insert_priv')){ $grant[] = 'INSERT'; }
    if($this->has_priv($params, 'update_priv')){ $grant[] = 'UPDATE'; }
    if($this->has_priv($params, 'delete_priv')){ $grant[] = 'DELETE'; }
    if($this->has_priv($params, 'file_priv')){ $grant[] = 'FILE'; }

    // Structure
    if($this->has_priv($params, 'create_priv')){ $grant[] = 'CREATE'; }
    if($this->has_priv($params, 'drop_priv')){ $grant[] = 'DROP'; }
    if($this->has_priv($params, 'index_priv')){ $grant[] = 'INDEX'; }
    if($this->has_priv($params, 'alter_priv')){ $grant[] = 'ALTER'; }
    if($this->has_priv($params, 'create_tmp_table_priv')){ $grant[] = 'CREATE TEMPORARY TABLES'; }
    if($this->has_priv($params, 'create_view_priv')){ $grant[] = 'CREATE VIEW'; }
    if($this->has_priv($params, 'event_priv')){ $grant[] = 'EVENT'; }
    if($this->has_priv($params, 'trigger_priv')){ $grant[] = 'TRIGGER'; }
    if($this->has_priv($params, 'show_view_priv')){ $grant[] = 'SHOW VIEW'; }
    if($this->has_priv($params, 'create_routine_priv')){ $grant[] = 'CREATE ROUTINE'; }
    if($this->has_priv($params, 'alter_routine_priv')){ $grant[] = 'ALTER ROUTINE'; }
    if($this->has_priv($params, 'execute_priv')){ $grant[] = 'EXECUTE'; }
    
    // Administration
    if($this->has_priv($params, 'lock_tables_priv')){ $grant[] = 'LOCK TABLES'; }
    if($this->has_priv($params, 'super_priv')){ $grant[] = 'SUPER'; }
    if($this->has_priv($params, 'process_priv')){ $grant[] = 'PROCESS'; }
    if($this->has_priv($params, 'reload_priv')){ $grant[] = 'RELOAD'; }
    if($this->has_priv($params, 'shutdown_priv')){ $grant[] = 'SHUTDOWN'; }
    if($this->has_priv($params, 'show_db_priv')){ $grant[] = 'SHOW DATABASES'; }
    if($this->has_priv($params, 'lock_tables_priv')){ $grant[] = 'LOCK TABLES'; }
    if($this->has_priv($params, 'references_priv')){ $grant[] = 'REFERENCES'; }
    if($this->has_priv($params, 'repl_client_priv')){ $grant[] = 'REPLICATION CLIENT'; }
    if($this->has_priv($params, 'repl_slave_priv')){ $grant[] = 'REPLICATION SLAVE'; }
    if($this->has_priv($params, 'create_user_priv')){ $grant[] = 'CREATE USER'; }

    return $grant;
  }

  function has_priv($params, $priv)
  {
    if(isset($params[$priv]))
    {
      if($params[$priv] == 'true')
      {
        return true;
      }
    }
    return false;
  }



  /*
  #
  # Adds database privileges to a specified user
  #
  */
  function add_database($params)
  {
    $result = query("GRANT ALL PRIVILEGES ON  `" . $params['db_name'] . "` . * TO  '" . $params['user_name'] . "'@'" . $params['host'] . "' WITH GRANT OPTION");
    if(isset($result['error']))
    {
      return format_response($result['error'], 'error');
    }
    else
    {
      if($params['response'] === 'get')
      {
        return $this->get($params);
      }
      else
      {
        return $this->get_database_privileges($params);
      }
    }
  }


  /*
  #
  # Removes privileges for db
  #
  */
  function revoke_database($params)
  {
    $result = query("REVOKE ALL PRIVILEGES ON  `" . $params['db_name'] . "` . * FROM  '" . $params['user_name'] . "'@'" . $params['host'] . "'");
    $result = query("REVOKE GRANT OPTION ON  `" . $params['db_name'] . "` . * FROM  '" . $params['user_name'] . "'@'" . $params['host'] . "'");
    
    if(isset($result['error']))
    {
      return format_response($result['error'], 'error');
    }
    else
    {
      return $this->get_database_privileges($params);
    }
  }



}