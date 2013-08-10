
var row_form = new Class
({
  
  initialize: function(dbName, tableName, where, callback)
  {
    var self = this;
    self.dbName = dbName;
    self.tableName = tableName;
    self.callback = callback;

    if(where === false)
    {
      // get the table cols, insert
      crack.request('a/db_schema/get_table_columns', {db_name: dbName, table_name: tableName}, {
        success: function(response)
        {
          self.renderForm(response, where);
        }
      });
    }
    else
    {
      // get the cols for a specific row and its values
      crack.request('a/db_schema/edit_row', {db_name: dbName, table_name: tableName, where: where}, 
      {
        success: function(response)
        {
          self.renderForm(response, where);
        }
      });
    }
  },


  renderForm: function(columns, where)
  {
    var self = this;
    var buttonText = where === false ? ' Insert row' : 'Save row';
    var form = templates['crack/templates/row_form']({columns: columns});
    var modal = crack.modal({
      head: 'Insert row',
      body: form,
      footer: [
        {
          type: 'button',
          html: '<i class="icon-plus-circled"></i> ' + buttonText,
          class: 'button button-primary',
          events: {
            click: function()
            {
              self.saveRow(modal, where);
            }
          }
        }
      ]
    });
  },


  saveRow: function(modal, where)
  {
    var self = this;

    var $fields = $$('#insert-row-wrap input');
    var data = {
      db_name: self.dbName, 
      table_name: self.tableName,
      columns: {}
    };

    if(where !== false)
    {
      data.where = where;
    }
    
    $fields.each(function($field)
    {
      data['columns'][$field.get('data-name')] = $field.value;
    });

    crack.request('a/db_schema/save_row', data, {
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
  }

});
