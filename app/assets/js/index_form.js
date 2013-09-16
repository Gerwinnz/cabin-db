
var index_form = new Class
({
  
  //
  //  Init a few things
  //
  initialize: function(dbName, tableName, columns, callback)
  {
    var self = this;

    self.callback = callback;
    self.tableName = tableName;
    self.dbName = dbName;
    self.columns = [];

    Object.each(columns, function(selected, columnName)
    {
      if(selected)
      {
        self.columns.push(columnName);
      }
    });

    self.renderForm();
  },


  renderForm: function()
  {
    var self = this;
    
    var tem = templates['templates/index_form']({columns: self.columns});

    // create the modal
    var modal = cabin.modal({
      head: 'Add index',
      body: tem,
      footer: [
        {
          type: 'button',
          html: '<i class="icon-plus-circled"></i> Add index',
          class: 'button button-primary',
          events: {
            click: function()
            {
              self.addIndex(modal);
            }
          }
        }
      ]
    });
  },


  //
  //  Save and add ajax calls
  //
  addIndex: function(modal)
  {
    var self = this;

    var data = {
      db_name: self.dbName,
      table_name: self.tableName,
      columns: self.columns, 
      index_name: $('index-name').value, 
      index_type: $('index-type').value
    };

    self.columns.each(function(column_name)
    {
      data[column_name + '_size'] = $(column_name + '-size').value;
    });
    
    cabin.request('a/db_schema/add_index', data, {
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
        cabin.alerts.new('error', error);
      }
    });
  }

});
