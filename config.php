<?php


	// default global config variables
	$config = array
	(
		'name'=>'Cabin DB',
		'db_auto_connect' => false,
		'db_username'=>'root',
		'db_password'=>'',
		'db_host'=>'localhost',
		'db_name'=>'',
		'base_url'=>'localhost/cabin-db/',
		
		'startup'=>array
		(
			'handlebars',
			'db_auth',
			'db_mysql'
		)
	);
	




	// server/environment specific
	$environment = array
	(
		
	);



?>