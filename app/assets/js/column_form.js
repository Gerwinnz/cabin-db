
var column_form = new Class
({
	
	//
	//	Init a few things
	//
	initialize: function(dbName, tableName, columnName, callback)
	{
		var self = this;

		// set for future
		self.dbName = dbName;
		self.tableName = tableName;
		self.columnName = columnName;
		self.callback = callback;

		// check for the column name, if undefined then empty form
		if(columnName === undefined)
		{
			self.renderForm();
		}
		else
		{
			self.getColumnDetails(columnName);
		}
	},


	renderForm: function(values)
	{
		var self = this;
		
		// default vals
		if(values === undefined)
		{
			var title = 'Add column';
			var buttonHTML = '<i class="icon-plus-circled"></i> Add column';
			var new_column = true;
		}
		else
		{
			var title = 'Edit column';
			var buttonHTML = '<i class="icon-floppy"></i> Save column';
			var new_column = false;

			// sort a few of the values out
			values.AUTO_INCREMENT = values.EXTRA === 'auto_increment' ? true : false;
			values.NULL = values.IS_NULLABLE === 'NO' ? false : true;
		}

		var collations = crack.data.collations_array;
		var types = crack.data.types_array.flatten();

		var tem = templates['templates/edit_column']({
			values: values, 
			types: types,
			collations: collations,
			new_column: new_column
		});

		// create the modal
		var modal = crack.modal({
			head: title,
			body: tem,
			footer: [
				{
					type: 'button',
					html: buttonHTML,
					class: 'button button-primary',
					events: {
						click: function()
						{
							var data = {
								db_name: 				self.dbName,
								table_name: 		self.tableName,
								column_name: 		self.columnName,
								new_name: 			$('column-name').value,
								type: 					$('data-type').value,
								length: 				$('length').value,
								default: 				$('default').value,
								collation: 			$('collation').value,
								null: 					$('is-null').checked,
								auto_increment: $('auto-increment').checked
							};

							if(new_column)
							{
								data['column_index'] = $('column-index').value;
								self.addColumn(data, modal);
							}
							else
							{
								self.saveColumn(data, modal);
							}
						}
					}
				}
			]
		});
	},


	//
	//	Save and add ajax calls
	//
	addColumn: function(data, modal)
	{
		var self = this;
		crack.request('a/db_schema/add_column', data, {
			success: function(response)
			{
				if(self.callback !== undefined)
				{
					self.callback(response);
				}
				modal.close();
			},
      error: function(error)
      {
        modal.close();
        crack.alerts.new('error', error);
      }
		});
	},

	saveColumn: function(data, modal)
	{
		var self = this;
		crack.request('a/db_schema/save_column', data, {
			success: function(response)
			{
				if(self.callback !== undefined)
				{
					self.callback(response);
				}
				modal.close();
			},
      error: function(error)
      {
        modal.close();
        crack.alerts.new('error', error);
      }
		});
	},



	//
	//	Renders the table's contents
	//
	getColumnDetails: function(columnName)
	{
		var self = this;
		crack.request('a/db_schema/get_column_details', {db_name: self.dbName, table_name: self.tableName, column: columnName}, {
			success: function(response)
			{
				self.renderForm(response);
			}
		});
	}

});
