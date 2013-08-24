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

		// when set to auto, we dynamically work out what it is
		'base_url' => 'auto',
		
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