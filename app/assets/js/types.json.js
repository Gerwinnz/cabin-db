var cabin = cabin || {};
cabin.data = cabin.data || {};

cabin.data.types = {
	INT: 					'INT',
	VARCHAR: 				'VARCHAR',
	TEXT: 					'TEXT',
	DATE: 					'DATE',
	
	NUMERIC: {
		TINYINT: 			'TINYINT',
		SMALLINT: 			'SMALLINT',
		MEDIUMINT: 			'MEDIUMINT',
		INT: 				'INT',
		BIGINT: 			'BIGINT',

		DECIMAL: 			'DECIMAL',
		FLOAT: 				'FLOAT',
		DOUBLE: 			'DOUBLE',
		REAL: 				'REAL',

		BIT: 				'BIT',
		BOOLEAN: 			'BOOLEAN',
		SERIAL: 			'SERIAL'
	},

	DATE_AND_TIME: {
		SERIAL: 			'DATE',
		DATETIME: 			'DATETIME',
		TIMESTAMP: 			'TIMESTAMP',
		TIME: 				'TIME',
		YEAR: 				'YEAR'
	},

	STRING: {
		CHAR: 				'CHAR',
		VARCHAR: 			'VARCHAR',

		TINYTEXT: 			'TINYTEXT',
		TEXT: 				'TEXT',
		MEDIUMTEXT: 		'MEDIUMTEXT',
		LONGTEXT: 			'LONGTEXT',

		BINARY: 			'BINARY',
		VARBINARY: 			'VARBINARY',

		TINYBLOB: 			'TINYBLOB',
		MEDIUMBLOB: 		'MEDIUMBLOB',
		BLOB: 				'BLOB',
		LONGBLOB: 			'LONGBLOB',

		ENUM: 				'ENUM',
		SET: 				'SET',
	},

	SPATIAL: {
		GEOMETRY: 			'GEOMETRY',
		POINT: 				'POINT',
		LINESTRING: 		'LINESTRING',
		POLYGON: 			'POLYGON',
		MULTIPOINT: 		'MULTIPOINT',
		MULTILINESTRING: 	'MULTILINESTRING',
		MULTIPOLYGON: 		'MULTIPOLYGON',
		GEOMETRYCOLLECTION: 'GEOMETRYCOLLECTION'
	}
};


cabin.data.types_array = [
	'INT',
	'VARCHAR',
	'TEXT',
	'DATE',
	
	[
		'TINYINT',
		'SMALLINT',
		'MEDIUMINT',
		'INT',
		'BIGINT',

		'DECIMAL',
		'FLOAT',
		'DOUBLE',
		'REAL',

		'BIT',
		'BOOLEAN',
		'SERIAL'
	],

	[
		'DATE',
		'DATETIME',
		'TIMESTAMP',
		'TIME',
		'YEAR'
	],

	[
		'CHAR',
		'VARCHAR',

		'TINYTEXT',
		'TEXT',
		'MEDIUMTEXT',
		'LONGTEXT',

		'BINARY',
		'VARBINARY',

		'TINYBLOB',
		'MEDIUMBLOB',
		'BLOB',
		'LONGBLOB',

		'ENUM',
		'SET',
	],

	[
		'GEOMETRY',
		'POINT',
		'LINESTRING',
		'POLYGON',
		'MULTIPOINT',
		'MULTILINESTRING',
		'MULTIPOLYGON',
		'GEOMETRYCOLLECTION'
	]
];