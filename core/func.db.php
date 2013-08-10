<?php

function select($table, $options = array())
{
	global $db;
	return $db->select($table, $options);
}


function select_one($table, $options = array())
{
	global $db;
	return $db->select_one($table, $options);
}


function update($table, $options = array())
{
	global $db;
	return $db->update($table, $options);
}

function insert($table, $options = array())
{
	global $db;
	return $db->insert($table, $options);
}

function query($sql)
{
	global $db;
	return $db->do_query($sql);
}

?>