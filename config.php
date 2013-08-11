<?php


	// default global config variables
	$config = array
	(
		'name'=>'Tooby',
		'db_username'=>'root',
		'db_password'=>'',
		'db_host'=>'127.0.0.1',
		'db_name'=>'',
		
		'startup'=>array
		(
			'handlebars',
			'db_auth',
			'db_mysql'
		),

		'rocks'=>array
		(
			'db' => 'db_schema',
			'logs' => 'logs'
		)
	);
	




	// server/environment specific
	$environment = array
	(
		'laptop.cabindb.com'=>array
		(
			'db_username'=>'root',
			'db_password'=>'zoeyb33f3d',
			'db_host'=>'',
			'db_name'=>''
		),


		'desktop.cabindb.com'=>array
		(
			'db_username'=>'root',
			'db_password'=>'',
			'db_host'=>'localhost',
			'db_name'=>''
		)
	);



?>