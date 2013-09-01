<?php


class db_schema
{

	//
	//	Set layout
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

		layout('crack');
	}


	//
	//	Default end point for controller, renders our page layout etc on arrival
	//
	function index()
	{
		global $db, $output, $app;
		$output->set('state', $this->get_state());
		$output->set('base_url', $app['base_url']);

		return view('db_schema/index');
	}


	//
	//	Generates a json string of the current logged in state
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



	/*
	#
	#	Database content requests
	#
	*/
	function get_databases()
	{
		$result = query("SHOW DATABASES");
		return format_response($result);
	}

	function get_database_info($params)
	{
		$result = query("SELECT default_collation_name FROM information_schema.SCHEMATA WHERE schema_name = '" . $params['db_name'] . "'");
		return format_response
		(
			array
			(
				'collation' => $result['rows'][0]['default_collation_name']
			)
		);
	}

	function create_database($params)
	{
		$result = query("CREATE DATABASE " . $params['new_db_name']);
		return $this->get_databases();
	}

	function save_database($params)
	{
		global $config;

		// save the options	
		$sql = "ALTER DATABASE `" . $params['db_name'] . "` COLLATE " . $params['collation'];
		$result = query($sql);

		if(isset($result['error']))
		{
			return format_response($result['error'], 'error');
		}
		else
		{
			return format_response($sql);
		}
	}

	function drop_database($params)
	{
		$result = query("DROP DATABASE " . $params['db_name']);

		if(isset($result['error']))
		{
			return format_response($result['error'], 'error');
		}
		else
		{
			return $this->get_databases();
		}
	}




	/*
	#
	#	Tables
	#
	*/
	function get_tables($params)
	{
		$result = query("SELECT * FROM INFORMATION_SCHEMA.tables WHERE table_schema = '" . $params['db_name'] . "' ORDER BY table_name DESC");

		// if this param is set, fetch the cols for each table in our result
		if(isset($params['get_table_cols']) && $params['get_table_cols'] == 'true')
		{
			foreach($result['rows'] as $index => $row)
			{
				$table_cols = $this->get_table_columns(array(
					'table_name' => $row['TABLE_NAME'],
					'db_name' => $params['db_name'],
					'raw' => true
				));

				$result['rows'][$index]['cols'] = $table_cols;
			}
		}

		return format_response($result['rows']);
	}

	function add_table($params)
	{
		query("CREATE TABLE " . $params['table_name'] . "(id int AUTO_INCREMENT, PRIMARY KEY (id))");
		return $this->get_tables($params);
	}




	


	

	/*
	#
	#	Table content
	#
	*/
	function get_table_content($params)
	{
		global $config;
		$chunk = 30;
		$start = $params['page'] * $chunk;

		$sql = "SELECT * FROM " . $params['db_name'] . '.' .$params['table_name'];

		// Check for order by info
		if(isset($params['order_by']))
		{
			if($params['order_by'] !== '')
			{
				$sql .= " ORDER BY `" . $params['order_by'] . "` " . $params['order'];
			}	
		}

		$sql .= " LIMIT " . $start . ", " . $chunk;


		$result = query($sql);
		if(isset($result['error']))
		{
			return format_response($result['error'], 'error');
		}
		$rows = $result['rows'];
		
		// check for a unique index
		$unique_index = false;
		$table_indexes = $this->get_table_indexes($params);

		foreach($table_indexes as $index)
		{
			if($index['unique'] == 'Yes')
			{
				$unique_index = $index['column_name'];
			}
		}

		foreach($rows as $index => $row)
		{
			foreach($row as $column => $value)
			{
				if(strlen($value) > 150)
				{
					$rows[$index][$column] = substr($value, 0, 150) . '...';
				}
			}
		}

		// return error or content
		if(isset($result['error']))
		{
			return format_response($result['error'], 'error');
		}
		else
		{
			return format_response(array(
				'rows' => $rows,
				'unique_index' => $unique_index
			));
		}
	}

	function save_row($params)
	{
		if(isset($params['where']))
		{
			$result = update($params['table_name'], array
			(
				'fields' => $params['columns'],
				'where' => $params['where']
			));
		}
		else
		{
			$result = insert($params['table_name'], $params['columns']);	
		}
		

		if(is_string($result))
		{
			return format_response($result, 'error');
		}
		else
		{
			$params['page'] = 0;
			return $this->get_table_content($params);
		}		
	}

	function delete_row($params)
	{
		$result = query("DELETE FROM `" . $params['table_name'] . "` " . $params['where']);

		if(is_string($result))
		{
			return format_response($result, 'error');
		}
		else
		{
			$params['page'] = 0;
			return $this->get_table_content($params);
		}		
	}

	function edit_row($params)
	{
		$result = query("SELECT * FROM `" . $params['table_name'] . "` " . $params['where']);

		if(is_string($result))
		{
			return format_response($result, 'error');
		}
		else
		{
			$return = array();
			foreach($result['rows'][0] as $column => $value)
			{
				$return[] = array('COLUMN_NAME' => $column, 'COLUMN_VALUE' => $value);
			}

			return format_response($return);
		}
	}




	/*
	#
	#	Table structure requests
	#
	*/
	function get_table_structure($params)
	{
		global $config;

		$result = query("SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '" . $params['table_name'] . "' AND table_schema = '" . $params['db_name'] . "'");
		$columns = $result['rows'];
		$indexes = $this->get_table_indexes($params);

		return format_response(array(
			'columns' => $columns, 
			'indexes' => $indexes
		));
	}

	function get_column_details($params)
	{
		global $config;

		$result = query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='" . $params['table_name'] . "' AND column_name = '" . $params['column'] . "' AND table_schema = '" . $params['db_name'] . "'");
		$column = $result['rows'];
		return format_response($column[0]);
	}

	function get_table_columns($params)
	{
		global $config;

		$result = query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='" . $params['table_name'] . "' AND table_schema = '" . $params['db_name'] . "'");
		$columns = $result['rows'];

		if(isset($params['raw']) && $params['raw'] == true)
		{
			return $columns;
		}

		return format_response($columns);
	}

	function save_column($params, $action = 'ALTER')
	{
		$type = mysql_real_escape_string($params['type']);

		// base sql
		if($action == 'ALTER')
		{
			$sql = "ALTER TABLE `" . $params['table_name'] . "` CHANGE `" . $params['column_name'] . "` `" . $params['new_name'] . "` " . $type;
		}
		elseif($action == 'ADD')
		{
			$sql = "ALTER TABLE `" . $params['table_name'] . "` ADD `" . $params['new_name'] . "` " . $type;
		}
		

		// length
		if($type == 'VARCHAR' || $type == 'INT')
		{
			if($params['length'] == '')
			{
				$params['length'] = $type == 'VARCHAR' ? 255 : 11;
			}
			$sql .= "(" . $params['length'] . ")";
		}

		// if type string
		if($type == 'TEXT' || $type == 'TINYTEXT' || $type == 'MEDIUMTEXT' || $type == 'LONGTEXT' || $type == 'VARCHAR' || $type == 'CHAR')
		{
			if($params['collation'] != '')
			{
				$sql .= " COLLATE " . $params['collation'];	
			}
		}

		// null end
		$sql .= $params['null'] == 'true' ? " NULL" : " NOT NULL";
		
		// auto increment
		$sql .= $params['auto_increment'] == 'true' ? ' AUTO_INCREMENT' : '';
		
		// check for index
		if($action == 'ADD')
		{
			if($params['column_index'] != '')
			{
				if($params['column_index'] == 'PRIMARY')
				{
					$sql .= ', ADD PRIMARY KEY(`' . $params['new_name'] . '`)';	
				}
				else
				{
					$sql .= ', ADD ' . $params['column_index'] . '(`' . $params['new_name'] . '`)';
				}
			}
		}

		// execute
		$result = query($sql);
		
		if(isset($result['error']))
		{
			return format_response($result['error'], 'error');
		}
		else
		{
			return $this->get_table_structure($params);
		}
	}

	function add_column($params)
	{
		return $this->save_column($params, 'ADD');
	}

	function drop_column($params)
	{
		$result = query("ALTER TABLE `" . $params['table_name'] . "` DROP `" . $params['column_name'] . "`");

		if(isset($result['error']))
		{
			return format_response($result['error'], 'error');
		}
		else
		{
			return $this->get_table_structure($params);
		}
	}

	function get_table_indexes($params)
	{
		global $config; 

		$result = query("SELECT index_name, column_name, seq_in_index, index_type, packed, non_unique, cardinality, collation, comment FROM INFORMATION_SCHEMA.STATISTICS WHERE table_name = '" . $params['table_name'] . "' AND table_schema = '" . $params['db_name'] . "' ORDER BY seq_in_index ASC");
		$indexes = $result['rows'];
		foreach($indexes as $key => $index)
		{
			$indexes[$key]['unique'] = $index['non_unique'] == 0 ? 'Yes' : 'No';
		}		
		return $indexes;
	}

	function add_index($params)
	{
		$index_type = $params['index_type'];
		$columns = $params['columns'];

		foreach($columns as $column_name)
		{
			$col_bit = '`' . $column_name . '`';
			if($params[$column_name . '_size'] != '')
			{
					$col_bit .= ' (' . $params[$column_name . '_size'] . ')';
			} 
			$col_bits[] = $col_bit;
		}
		$col_sql = implode(',', $col_bits);
		

		if($index_type != 'PRIMARY')
		{
			$index_name = $params['index_name'] == '' ? '' : '`' . $params['index_name'] . '`';
		}

		$sql = "ALTER TABLE `" . $params['table_name'] . "` ADD " . $index_type . $index_name . "(" . $col_sql . ")";

		$result = query($sql);
		
		if(isset($result['error']))
		{
			return format_response($result['error'], 'error');
		}
		else
		{
			return $this->get_table_structure($params);
		}
	}

	function drop_index($params)
	{
		$indexName = $params['index_name'] == 'PRIMARY' ? 'PRIMARY KEY' : 'INDEX ' . $params['index_name'];

		$sql = "ALTER TABLE `" . $params['table_name'] . "` DROP " . $indexName;
		
		$result = query($sql);

		if(isset($result['error']))
		{
			return format_response($result['error'], 'error');
		}
		else
		{
			return $this->get_table_structure($params);
		}
	}




	/*
	#
	#	Table option requests
	#
	*/
	function get_table_options($params)
	{
		global $config;

		$result = query("SELECT * FROM INFORMATION_SCHEMA.tables WHERE table_schema = '" . $params['db_name'] . "' AND table_name = '" . $params['table_name'] . "'");
		return format_response($result['rows'][0]);
	}

	function save_table_options($params)
	{
		global $config;

		// check if we need to rename the table first
		$table_name = $params['table_name'];
		if($params['new_table_name'] != $params['table_name'])
		{
			$result = query("ALTER TABLE " . $table_name . " RENAME TO " . $params['new_table_name']);
			if(is_string($result))
			{
				return format_response($result, 'error');
			}
			$table_name = $params['new_table_name'];
		}

		// save the options	
		$sql = "ALTER TABLE `" . $table_name . "` COMMENT ='" . $params['table_comment'] . "' ENGINE = " . $params['storage_engine'] . " COLLATE " . $params['collation'];
		$result = query($sql);

		if(is_string($result))
		{
			return format_response($result, 'error');
		}
		else
		{
			return format_response($sql);
		}
	}

	function delete_table_rows($params)
	{
		$result = query("TRUNCATE TABLE " . $params['table_name']);
		return format_response('All rows deleted');
	}

	function drop_table($params)
	{
		query("DROP TABLE " . $params['table_name']);
		return format_response('Table dropped');
	}




	/*
	#
	#	Raw sql
	#
	*/
	function do_sql($params)
	{
		$chunk = 30;
		$start = $params['page'] * $chunk;

		$sql = $params['sql'];
		if($sql == '')
		{
			return format_response('Empty query', 'error');
		}

		// check for a limit on select queries
		if(substr(strtolower($sql), 0, 6) == 'select')
		{
			if (!preg_match("/limit [0-9]/", strtolower($sql), $matches))
			{
				$sql .= ' LIMIT ' . $start . ', ' . $chunk;
			}
		}

		$result = query($sql);
		if(isset($result['error']))
		{
			return format_response($result['error'], 'error');
		}
		else
		{
			return format_response($result);
		}
	}
}


?>