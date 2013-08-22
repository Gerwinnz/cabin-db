<?php


	// default global config variables
	$config = array
	(
		'name'=>'Cabin DB',
		'db_auto_connect' => false,
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
		
	);



?>