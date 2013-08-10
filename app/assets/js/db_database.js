
var db_database = new Class
({
	
	//
	//	Init a few things
	//
	initialize: function(dbName, cabin_db)
	{
		var self = this;

		// vars
		self.cabin_db = cabin_db;
    self.dbName = dbName;

    // render
    self.getTables(true);
	},


	//
	//	Render layout
	//
	renderLayout: function()
	{
		var self = this;
	
		// place render our shell
    $('app').empty();
    $('app').set('html', templates['crack/templates/db_database']());

    self.$tablesPane = $('tables-pane');
    self.$contentPane = $('content-pane');
    self.$tablesList = $('tables-list');

    self.tableName = null;

		// add events
    self.$tablesList.addEvent('click:relay(a)', function(event, $el)
		{
			self.$tablesPane.getElements('a').removeClass('current');
			$el.addClass('current');
			self.tableName = $el.get('data-table');
			var t = new table(self.dbName, self.tableName);
		});

		self.$tablesPane.addEvent('click:relay(a.new-table)', function(event, $el)
		{
			self.newTable();
		});
	},


	//
	//	Table methods
	//
	newTable: function()
	{
		var self = this;
		var modal = crack.modal({
			head: 'New table',
			body: '<input type="text" id="new-table-name-field" />',
			footer: [
				{
					type: 'button',
					html: '<i class="icon-plus-circled"></i> Create',
					class: 'button button-primary',
					events: {
						click: function(){
							var tableName = $('new-table-name-field').value;
							if(tableName !== '')
							{
								crack.request('a/db_schema/add_table', {table_name: tableName, db_name: self.dbName}, {
									success: function(response)
									{
										self.renderTables(response);
										if(self.tableName === null)
										{
											self.renderDatabaseHome(response);
										}
										modal.close();
									}
								});
							}
						}
					}
				}
			]
		});
	},

	getTables: function(fullView)
	{
		var self = this;
		crack.request('a/db_schema/get_tables', {db_name: self.dbName}, {
			success: function(response)
			{
				if(fullView)
				{
					self.renderLayout();
					self.renderDatabaseHome(response);
				}
				self.renderTables(response);
			}
		});
	},

	renderDatabaseHome: function(response)
	{
		var self = this;
		var totalTables = 0;
		var totalRows = 0;
		var totalSize = 0;
		
		// pre process 
		response.each(function(table)
		{
			totalTables ++;
			totalRows = totalRows + parseInt(table.TABLE_ROWS);
			totalSize = totalSize + parseInt(table.DATA_LENGTH);

			table.size = crack.readableBytes(table.DATA_LENGTH);
		});

		// render
		self.$contentPane.set('html', templates['crack/templates/database_home'](
		{
			tables: response,
			total_tables: totalTables,
			total_rows: totalRows,
			total_size: crack.readableBytes(totalSize),
			db_name: self.dbName
		}));


		self.$tablesListDetailed = self.$contentPane.getElement('.tables-list');


		// init tabs
    var tabs = new crack_tabs(self.$contentPane.getElement('.tabs'), {
      tables: function(){
        
      },
      schema: function(){
      	var schemaView = new db_schema(self.dbName);
      },
      users: function(){
        var usersView = new db_users(self.dbName);
      },
      options: function(){
        var optionsView = new db_options(self.dbName, self.cabin_db); 
      }
    });

		// Add click event to go to table
		self.$tablesListDetailed.addEvent('click:relay(a.table-link)', function(event, $el)
		{
			self.tableName = $el.get('data-table');
			var t = new table(self.dbName, self.tableName);
		});

		// Drop table
		self.$tablesListDetailed.addEvent('click:relay(button.delete-row)', function(event, $el)
		{
			var tableName = $el.get('data-table');
			crack.confirm('Are you sure you want to DROP ' + tableName + '?', function(modal)
	    {
	      crack.request('a/db_schema/drop_table', {db_name: self.dbName, table_name: tableName}, {
	        success: function(response)
	        {
	          crack.alerts.new('success', response);
	           $$('#tables-list a.table_' + tableName).destroy();
	           self.$tablesListDetailed.getElement('tr.table_' + tableName).destroy();
	           modal.close();
	        }
	      });
	    });
		});
	},

	renderTables: function(response)
	{
		var self = this;
		self.$tablesList.set('html', templates['crack/templates/tables']({tables: response}));
	}

});