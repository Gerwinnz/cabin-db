<?php


	// default global config variables
	$config = array
	(
		'name'=>'Tooby',
		'db_username'=>'root',
		'db_password'=>'',
		'db_host'=>'127.0.0.1',
		'db_name'=>'',

		'last_fm_api_root'=>'http://ws.audioscrobbler.com/2.0/',
		'last_fm_api_key'=>'d93f5bc656fdb3744a345c367271323b',
		'last_fm_secret'=>'6b60c10f9523e27ccef66a15f36b15bd',
		
		'startup'=>array
		(
			'auth',
			'handlebars'
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
		'dev.tooby.co'=>array
		(
			'db_username'=>'root',
			'db_password'=>'zoeyb33f3d',
			'db_host'=>'',
			'db_name'=>''
		),


		'desktop.tooby.co'=>array
		(
			'db_username'=>'root',
			'db_password'=>'',
			'db_host'=>'localhost',
			'db_name'=>''
		)
	);



?>