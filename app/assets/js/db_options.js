
var db_options = new Class
({
  
  //
  //  Init a few things
  //
  initialize: function(dbName, cabin_db)
  {
    var self = this;

    // cache el
    self.$optionsWrap = $('db-options');

    // set vars
    self.cabin_db = cabin_db;
    self.dbName = dbName;
    
    // get the users
    self.getDatabaseOptions();
  },


  //
  //  Fetch info about our db
  //
  getDatabaseOptions: function()
  {
    var self = this;

    cabin.request('a/db_schema/get_database_info', {db_name: self.dbName}, {
      success: function(response)
      {
        self.renderOptions(response);
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
  renderOptions: function(database_info)
  {
    var self = this;

    // set contents
    self.$optionsWrap.removeEvents();
    self.$optionsWrap.set('html', templates['templates/db_options'](
    {
      db_name: self.dbName,
      database: database_info,
      collations: cabin.data.collations_array
    }));

    self.$optionsWrap.addEvent('click:relay(button.drop-db)', function(event, $el)
    {
      cabin.confirm('Are you sure you want to DROP ' + self.dbName + '?', function(modal){
        self.dropDatabase(modal);
      });
    });

    self.$optionsWrap.addEvent('click:relay(button.save-db)', function(event, $el)
    {
      self.saveOptions();
    });
  },



  //
  //  Saves current db options
  //
  saveOptions: function()
  {
    var self = this;
    cabin.request('a/db_schema/save_database', 
      {
        db_name: self.dbName, 
        collation: $('db-collation').value 
      },
      {
        success: function(response)
        {
          cabin.alerts.new('success', 'Options for \'' + self.dbName + '\' succesfully saved.');
        },
        error: function(error)
        {
          cabin.alerts.new('error', error);
        }
      }
    );
  },



  //
  //  Drops the current db
  //
  dropDatabase: function(modal)
  {
    var self = this;
    cabin.request('a/db_schema/drop_database', {db_name: self.dbName}, {
      success: function(response)
      {
        self.cabin_db.renderTopBarControls(self.cabin_db.state.databases.rows);
        self.cabin_db.renderDashboard();
        cabin.alerts.new('success', 'Succesfully DROPPED \'' + self.dbName + '\'');
        modal.close();
      },
      error: function(error)
      {
        self.cabin_db.renderTopBarControls(self.cabin_db.state.databases.rows);
        self.cabin_db.renderDashboard();
        cabin.alerts.new('error', error);
        modal.close();
      }
    });
  }


});