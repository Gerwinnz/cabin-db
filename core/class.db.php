<?php


class db_mysql
{
	private $connection;
	

	//
	//	Connect
	//
	function connect($dbhost, $dbuser, $dbpassword, $dbname)
	{
		$this->connection = mysqli_connect($dbhost,$dbuser,$dbpassword, $dbname);
	}
	
	function query($sql)
	{
		// echo '<div>'.$sql.'</div>';
		return $this->connection->query($sql);
	}
	
	function escape($val)
	{
		return $this->connection->escape_string($val);
	}	

	function do_query($sql)
	{
		$start_time = microtime(true);
		$result = $this->query($sql);
		$end_time = microtime(true);
		$time_to_execute = $end_time - $start_time;

		if($result)
		{
			//die(format_response(print_r($result, true), 'error'));
			if(is_object($result))
			{
				$items = array();
				while($row = $result->fetch_assoc())
				{
					$items[] = $row;
				}
				$result->free();
				return array(
					'rows' => $items,
					'time' => $time_to_execute,
					'rows_affected' => $this->connection->affected_rows
				);
			}
			else
			{
				return array(
					'result' => $result,
					'time' => $time_to_execute,
					'rows_affected' => $this->connection->affected_rows
				);
			}
		}	
		else
		{
			if($this->connection->error != null)
			{
				return array(
					'error' => $this->connection->error
				);	
			}
		}

		return true;
	}
	
	
	//
	//	Select methods
	//
	function select_one($table, $where = array())
	{
		$result = $this->select($table, $where);
		return $result[0];
	}

	function select($table, $options = array())
	{
		$select = '*';
		$whereSql = '';
		$orderSql = '';
		$limitSql = '';
		
		if(isset($options['where']))
		{
			$whereFlag = true;
			foreach($options['where'] as $field => $value)
			{
				$whereSql .= $whereFlag ? " WHERE " : " AND ";
				$whereSql .= "`".$this->escape($field)."`='".$this->escape($value)."'";
				$whereFlag = false;
			}	
		}
		
		if(isset($options['order']))
		{
			$order = $options['order'];
			if(is_array($order))
			{
				$orderFlag = true;
				foreach($options['order'] as $field)
				{
					$orderSql .= $orderFlag ? " ORDER BY " : " , ";
					$orderSql .= " `".$field."` ";
					$orderFlag = false;
				}
			}
			else
			{
				$orderSql = " ORDER BY ". $order;
			}
		}

		if(isset($options['limit']))
		{
			$limit = $options['limit'];
			if(is_array($limit))
			{
				$limitSql = " LIMIT ".$limit[0];
				$limitSql .= isset($limit[1]) ? ",".$limit[1] : '';
			}
			else
			{
				$limitSql = " LIMIT ".$limit;
			}
		}

		if(isset($options['distinct']))
		{
			$distinct = $options['distinct'];
			if(is_array($distinct))
			{
				foreach($distict as $key => $distinctField)
				{
					$distinct[$key] = $this->escape($distinctField);
				}
				$select = 'DISTINCT `'.implode(',', $distinct).'`';
			}
			else
			{
				$select = 'DISTINCT `'.$this->escape($distinct).'`';
			}
		}

		// return a big array of each row
		if($result = $this->query("SELECT ".$select." FROM `".$this->escape($table)."` ".$whereSql.$orderSql.$limitSql))
		{
			while($row = $result->fetch_assoc())
			{
				$items[] = $row;
			}
		}

		$result->free();

		return $items;
	}



	//
	//	Insert
	//
	function insert($table, $options = array())
	{
		foreach($options as $column => $value)
		{
			$columns[] = '`' . $this->escape($column) . '`';
			$values[] = '\'' . $this->escape($value) . '\'';
		}

		$columns = implode(',', $columns);
		$values = implode(',', $values);

		$result = $this->query("INSERT INTO `".$this->escape($table)."` (".$columns.") VALUES(".$values.")");
		return mysql_insert_id();
	}



	//
	//	Update
	//
	function update($table, $options = array())
	{
		$fieldsSql = '';
		$fieldChunks = array();

		if(isset($options['fields']))
		{
			foreach($options['fields'] as $field => $value)
			{
				$fieldChunks[] = "`".$this->escape($field)."`='".$this->escape($value)."'";
			}
			$fieldsSql = implode(',', $fieldChunks);
		}
		else
		{
			return false;
		}
		
		if(isset($options['where']))
		{
			if(is_string($options['where']))
			{
				$whereSql = ' ' . $options['where'];
			}
			else
			{
				$whereFlag = true;
				foreach($options['where'] as $field => $value)
				{
					$whereSql .= $whereFlag ? " WHERE " : " AND ";
					$whereSql .= "`".$this->escape($field)."`='".$this->escape($value)."'";
					$whereFlag = false;
				}	
			}
		}

		$result = $this->query("UPDATE `".$this->escape($table)."` SET ".$fieldsSql.$whereSql);
		return $result;
	}
	
	//
	//	Close the mysql connection
	//
	function close()
	{
		$this->connection->close();
	}
}