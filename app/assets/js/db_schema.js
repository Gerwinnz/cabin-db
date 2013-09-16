
var db_schema = new Class
({
  
  //
  //  Init a few things
  //
  initialize: function(dbName)
  {
    var self = this;

    // cache el
    self.$schemaWrap = $('db-schema');

    // set vars
    self.dbName = dbName;
    
    // get the users
    self.getTables();
  },


  //
  //  Get tables and their cols
  //
  getTables: function()
  {
    var self = this;
    cabin.request('a/db_schema/get_tables', {db_name: self.dbName, get_table_cols: true}, {
      success: function(response)
      {
        self.renderSchema(response);
      },
      error: function(error)
      {
        cabin.alerts.new('error', error);
      }
    });
  },

  //
  //  Render our layout and add events
  //
  renderSchema: function(tables)
  {
    var self = this;
    self.$schemaWrap.empty();

    // Render and append tables
    tables.each(function(table)
    {
      // pre process
      var key = self.dbName + '_' + table.TABLE_NAME;
      var x = localStorage.getItem(key + '_x');
      var y = localStorage.getItem(key + '_y');

      table.x = x === null ? 0 : x;
      table.y = y === null ? 0 : y;

      // render
      var $tableEl = new Element('div', {
        class: 'schema-table',
        style: 'top: ' + y + 'px; left: ' + x + 'px;',
        html: templates['templates/db_schema']({table: table})
      });

      // append
      self.$schemaWrap.adopt($tableEl);

      // init drag
      var drag = new Drag($tableEl, {
        handle: '.header',
        grid: 10,
        onSnap: function($el)
        {
          $el.addClass('dragging');
        },
        onComplete: function($el)
        {
          var coords = $el.getCoordinates(self.$schemaWrap);
          $el.removeClass('dragging');

          localStorage.setItem(key + '_x', coords.left);
          localStorage.setItem(key + '_y', coords.top);
        }
      });
    });
  }

});