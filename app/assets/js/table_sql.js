
var table_sql = new Class
({
  
  //
  //  Init a few things
  //
  initialize: function(dbName, tableName)
  {
    var self = this;
    self.$el = $('table_sql');
    
    self.dbName = dbName;
    self.tableName = tableName;
    self.renderInterface();

    self.$content = $('result-content');
    self.$sqlField = self.$el.getElement('#sql-field');

    self.page = 0;
    self.sql = '';

    //  Events
    self.$el.removeEvents();

    // Execute
    self.$el.addEvent('click:relay(button.execute-sql)', function(event, $el)
    {
      self.page = 0;
      self.sql = self.editor.getValue();
      self.executeSql(self.sql);
    });

    self.$el.addEvent('click:relay(button.load-more)', function(event, $el)
    {
      self.executeSql(self.sql);
    });
  },

  renderInterface: function()
  {
    var self = this;
    self.$el.empty();
    self.$el.set('html', templates['crack/templates/table_sql']({table_name: self.tableName}));

    self.editor = ace.edit("editor");
    self.editor.renderer.setShowGutter(false);
    self.editor.setTheme("ace/theme/eclipse");
    self.editor.getSession().setMode("ace/mode/sql");
  },


  //
  //  Send the sql to the server
  //
  executeSql: function(sql)
  {
    var self = this;

    crack.request('a/db_schema/do_sql', {db_name: self.dbName, sql: sql, page: self.page}, 
    {
      success: function(response)
      {
        if(response.rows !== undefined)
        {
          if(self.page === 0)
          {
            self.$content.empty();
            crack.alerts.new('success', 'Fetched ' + response.rows_affected + ' rows in ' + response.time.toFixed(5) + ' seconds.');
          }
          self.renderContent(response, self.page);
        }
        else
        {
          crack.alerts.new('success', 'Success: ' + response.rows_affected + ' ' + crack.pluralize('row', response.rows_affected) + ' affected. Query took ' + response.time.toFixed(5) + ' seconds.');
        }
      }, 
      error: function(error)
      {
        crack.alerts.new('error', error);
      }
    });
  },


  //
  //  Render the response content
  //
  renderContent: function(response, page)
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
        columns.push({name: columnName});
      }

      if(response.rows.length === 30)
      {
        showLoadMore = true;
      }

      if(response.rows.length === 0)
      {
        noRows = true;
      }
      
      var tem = templates['crack/templates/table_content']({
        columns: columns, 
        showLoadMore: showLoadMore,
        no_rows: noRows,
        show_actions: false
      });

      self.$content.set('html', tem);
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

      var tem = templates['crack/templates/table_row']({columns: columns, where: where})
      var $t = new Element('tr', {html: tem});

      self.$contentTable.adopt($t);
    });
  }

});
