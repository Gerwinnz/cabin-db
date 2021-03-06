
var table = new Class
({
	
  //
  //  Some shared values
  // 
  dbName: null,
  tableName: null,
  orderBy: '',
  order: 'DESC',
  filterColumn: '',
  filterQuery: '',


	//
	//	Init a few things
	//
	initialize: function(dbName, tableName)
	{
		var self = this;

		// set for future
    self.dbName = dbName;
		self.tableName = tableName;

		// define selectors
		self.$contentPane = $('content-pane');

		// fetch the base html
		self.$contentPane.set('html', templates['templates/table']({'table_name': tableName}));

    // set new selectors
		self.$structure = $('table_structure');
		self.$content = $('table_content');

    self.page = 0;

    // init tabs
    var tabs = new cabin_tabs(self.$contentPane.getElement('.tabs'), {
      content: function(){
        self.getContent(0, true);
      },
      structure: function(){
        self.getStructure();
      },
      sql: function(){
        var sql = new table_sql(dbName, tableName);
      },
      options: function(){
        var options = new table_options(dbName, tableName);
      }
    });


    //	Edit column
  	self.$structure.addEvent('click:relay(button.edit-column)', function(event, $el)
		{
			self.editColumn($el.get('data-column'));
		});

  	//	Drop column
		self.$structure.addEvent('click:relay(button.drop-column)', function(event, $el)
		{
			cabin.confirm('Are you sure you want to drop column \'' + $el.get('data-column') + '\' from \'' + tableName + '\'?', function(modal){
				self.dropColumn($el.get('data-column'), modal);
			});
		});

		//	Add column
		self.$structure.addEvent('click:relay(button.add-column)', function(event, $el)
		{
			self.addColumn();
		});

    //  Add index
    self.$structure.addEvent('click:relay(button.add-index)', function(event, $el)
    {
      self.addIndex();
    });

    // Drop index
    self.$structure.addEvent('click:relay(button.drop-index)', function(event, $el)
    {
      cabin.confirm('Are you sure you want to drop index \'' + $el.get('data-index') + '\' from \'' + tableName + '\'?', function(modal){
        self.dropIndex($el, modal);
      });
    });

    // Select rows
    self.$structure.addEvent('change:relay(input.select-row)', function(event, $el)
    {
      self.selectRow($el);
    });



		//	Load more
		self.$content.addEvent('click:relay(button.load-more)', function(event, $el)
		{
			self.getContent(self.page);
		});

    // order by
    self.$content.addEvent('click:relay(a.column-name)', function(event, $el)
    {
      var newOrderBy = $el.get('data-column')
      if(newOrderBy === self.orderBy)
      {
        self.order = self.order === 'DESC' ? 'ASC' : 'DESC';  
      }
      else
      {
        self.order = 'ASC';
      }
      self.orderBy = newOrderBy;
      self.getContent();
    });

    // filter results
    self.$content.addEvent('keyup:relay(#filter-field)', function(event, $el)
    {
      self.filterColumn = $('filter-select').value;
      self.filterQuery = $el.value;
      self.getContent();
    });

    self.$content.addEvent('click:relay(button.search-button)', function(event, $el)
    {
      self.filterColumn = $('filter-select').value;
      self.filterQuery = $('filter-field').value;
      self.getContent();
    });

    self.$content.addEvent('change:relay(#filter-select)', function(event, $el)
    {
      self.filterColumn = $('filter-select').value;
      self.filterQuery = $('filter-field').value;
      self.getContent();
    });

    // insert row
    self.$content.addEvent('click:relay(button.insert-row)', function(event, $el)
    {
      self.insertRow();
    });

    // edit row
    self.$content.addEvent('click:relay(button.edit-row)', function(event, $el)
    {
      self.editRow($el);
    });

    // delete row
    self.$content.addEvent('click:relay(button.delete-row)', function(event, $el)
    {
      self.deleteRow($el);
    });

		// init with the content
		self.getContent(0, true);
	},


  //
  //  Column actions (structure)
  //
  editColumn: function(columnName)
  {
    var self = this;
    var c = new column_form(self.dbName, self.tableName, columnName, function(cols){
    	self.renderStructure(cols);
    });
  }, 

  addColumn: function()
  {
  	var self = this;
  	var c = new column_form(self.dbName, self.tableName, undefined, function(response){
    	self.renderStructure(response);
    });
  },

  dropColumn: function(columnName, modal)
  {
  	var self = this;
  	cabin.request('a/api/v1/db_schema/drop_column', {db_name: self.dbName, table_name: self.tableName, column_name: columnName}, {
  		success: function(response)
  		{
  			self.renderStructure(response);
  			modal.close();
  		}
  	});
  },


  //
  //  Row actions (content)
  //
  insertRow: function()
  {
    var self = this;
    var rowForm = new row_form(self.dbName, self.tableName, false, function(response){
      self.renderContent(response, 0);
    });
  },

  editRow: function($el)
  {
    var self = this;
    var where = $el.getPrevious().get('text');

    var rowForm = new row_form(self.dbName, self.tableName, where, function(response){
      self.renderContent(response, 0);
    });
  },

  deleteRow: function($el)
  {
    var self = this;
    var where = $el.getPrevious().get('text');

    cabin.confirm('Are you sure you want to delete this row?<div style="padding-top:10px;">DELETE FROM `' + self.tableName + '` ' + where + '</div>', function(modal)
    {
      cabin.request('a/api/v1/db_schema/delete_row', {db_name: self.dbName, table_name: self.tableName, where: where}, 
      {
        success: function(response)
        {
          self.renderContent(response, 0);
          modal.close();
        }, 
        error: function(error)
        {
          modal.close();
          cabin.alerts.new('error', error);
        }
      });
    });
  },


  //
  //  Index actions
  //
  addIndex: function()
  {
    var self = this;
    var indexForm = new index_form(self.dbName, self.tableName, self.selectedColumns, function(response){
      self.renderStructure(response);
    });
  },

  dropIndex: function($el, modal)
  {
    var self = this;
    
    cabin.request('a/api/v1/db_schema/drop_index', {db_name: self.dbName, table_name: self.tableName, index_name: $el.get('data-index')}, {
      success: function(response)
      {
        self.renderStructure(response);
        modal.close();
      }, 
      error: function(error)
      {
        modal.close();
        cabin.alerts.new('error', error);
      }
    });
  },

  selectRow: function($el)
  {
    var self = this;
    var column = $el.get('data-column');

    self.selectedColumns[column] = $el.checked;
    self.checkSelected();
  },

  checkSelected: function()
  {
    var self = this;
    var selectedCount = 0;

    Object.each(self.selectedColumns, function(selected, col)
    {
      if(selected === true)
      {
        selectedCount ++;
      }
      
      var checkbox = $('select-' + col);
      if(checkbox)
      {
        $('select-' + col).checked = selected;
      }
    });

    if(selectedCount > 0)
    {
      $$('.add-index').setStyle('display', 'inline');
    }
    else
    {
      $$('.add-index').setStyle('display', 'none');
    }
  },


	//
	//	Renders the table's contents
	//
	getContent: function(page, renderControls)
	{
		var self = this;
		if(page === undefined) { page = 0; }

		cabin.request('a/api/v1/db_schema/get_table_content', 
      {
        db_name: self.dbName, 
        table_name: self.tableName, 
        page: page, 
        order_by: self.orderBy, 
        order: self.order,
        filter_column: self.filterColumn,
        filter_query: self.filterQuery
      }, 
      {
  			success: function(response)
  			{
  				self.renderContent(response, page, renderControls);
  			},
        error: function(error)
        {
          cabin.alerts.new('error', error);
        }
		  }
    );
	},

  renderContent: function(response, page, renderControls)
  {
    var self = this;

    // if first time, setup the table
    if(page === 0)
    {
      var columns = [];
      var showLoadMore = false;
      var noRows = false;
      for(var columnName in response.rows[0])
      { 
        var className = self.orderBy === columnName ? ('active-' + self.order.toLowerCase()) : '';
        columns.push({name: columnName, class_name: className});
      }

      if(response.rows.length === 30)
      {
        showLoadMore = true;
      }

      if(response.rows.length === 0)
      {
        noRows = true;
      }
      
      // Don't re-render controls if we don't have to
      if(renderControls === true)
      {
        self.$content.empty();
        var tem = templates['templates/table_content']({
          columns: columns, 
          showLoadMore: showLoadMore,
          no_rows: noRows,
          show_actions: true
        });

        self.$content.set('html', tem);
      }
      
      var tem = templates['templates/table_content_results']({
        columns: columns, 
        showLoadMore: showLoadMore,
        no_rows: noRows,
        show_actions: true
      });

      $('table-content-results').set('html', tem);
      self.$contentTable = self.$content.getElement('table');
    }

    // incremenet the page
    self.page = page + 1;

    // append rows
    self.addRows(response.rows, response.unique_index);
  },

	addRows: function(rows, unique_index)
	{
		var self = this;
    var where = '';

		rows.each(function(row)
		{
			var columns = [];
      var deleteChunks = [];

      if(unique_index)
      {
        for(var columnName in row) 
        { 
          columns.push({value: row[columnName]}); 
        }
        where = "WHERE `" + unique_index + "`='" + row[unique_index].replace(/'/g, "\\'") + "'";
      }
      else
      {
        for(var columnName in row) 
        { 
          columns.push({value: row[columnName]});
          deleteChunks.push("`" + columnName + "`='" + row[columnName].replace(/'/g, "\\'") + "'");
        }
        where = 'WHERE ' + deleteChunks.join(' AND ') + ' LIMIT 1';
      }

      var tem = templates['templates/table_row']({columns: columns, where: where})
			var $t = new Element('tr', {html: tem});

			self.$contentTable.adopt($t);
		});
	},





	//
	//	Renders the table's structure
	//
	getStructure: function()
	{
		var self = this;
		cabin.request('a/api/v1/db_schema/get_table_structure', {db_name: self.dbName, table_name: self.tableName}, {
			success: function(response)
			{
       	self.renderStructure(response);
       	self.selectedColumns = {};
			}
		});
	},

	renderStructure: function(data)
	{
		var self = this;
    self.$structure.empty();
		self.$structure.set('html', templates['templates/table_structure'](data));
    self.checkSelected();
	}

});
