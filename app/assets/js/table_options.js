
var table_options = new Class
({
  
  //
  //  Init a few things
  //
  initialize: function(dbName, tableName)
  {
    var self = this;
    self.$options = $('table_options');
    
    // set for later
    self.dbName = dbName;
    self.tableName = tableName;

    self.getInfo(tableName);

    //  Events
    self.$options.removeEvents();

    // Save
    self.$options.addEvent('click:relay(button.save-table)', function(event, $el)
    {
      self.save();
    });

    // Drop and delete rows
    self.$options.addEvent('click:relay(button.drop-table)', function(event, $el)
    {
      self.drop();
    });
    self.$options.addEvent('click:relay(button.delete-rows)', function(event, $el)
    {
      self.deleteRows($el);
    });
  },

  getInfo: function()
  {
    var self = this;
    cabin.request('a/api/v1/db_schema/get_table_options', {db_name: self.dbName, table_name: self.tableName}, {
      success: function(response)
      {
        self.renderOptions(response);
      }
    });
  },

  renderOptions: function(response)
  {
    var self = this;
    response['collations'] = cabin.data.collations_array;
    response['storage_engines'] = cabin.data.storage_engines;
    self.$options.set('html', templates['templates/table_options'](response));
  },

  save: function()
  {
    var self = this;
    var inputs = $$('#table-options-form input, #table-options-form select');
    var data = {db_name: self.dbName, table_name: self.tableName};
    inputs.each(function($input)
    {
      data[$input.get('name')] = $input.value;
    });

    cabin.request('a/api/v1/db_schema/save_table_options', data, {
      success: function(sql)
      {
        cabin.alerts.new('success', 'Table succesfully altered', sql);
        if(data.table_name !== data.new_table_name)
        {
          var $tableTab = $$('#tables-list a.current');
          $tableTab.set('data-table', data.new_table_name);
          $tableTab.getElement('.name').set('text', data.new_table_name);
        }
      },
      error: function(error)
      {
        cabin.alerts.new('error', error);
      }
    });
  },


  //
  //
  //
  drop: function()
  {
    var self = this;
    cabin.confirm('Are you sure you want to DROP ' + self.tableName + '?', function(modal)
    {
      cabin.request('a/api/v1/db_schema/drop_table', {db_name: self.dbName, table_name: self.tableName}, {
        success: function(response)
        {
          cabin.alerts.new('success', response);
           $$('#tables-list a.current').destroy();
           modal.close();
        }
      });
    });
  },

  deleteRows: function($button)
  {
    var self = this;
    var row_count = $button.get('data-rows');
    cabin.confirm('Are you sure you want to delete all ' + row_count + ' rows from ' + self.tableName + '?', function()
    {
      cabin.request('a/api/v1/db_schema/delete_table_rows', {db_name: self.dbName, table_name: self.tableName}, {
        success: function(response)
        {
          cabin.alerts.new('success', response);
          $$('#tables-list a.current .rows').set('text', '(0)');
        }
      });
    });
  }
});
