
var dashboard = new Class
({
  
  //
  //  Init a few things
  //
  initialize: function(cabin_db)
  {
    var self = this;

    self.cabin_db = cabin_db;

    // place out schema layout into the app root container
    $('app').empty();
    $('app').set('html', templates['templates/dashboard']());

    self.getDatabases();

    // cache els
    self.$databaseWrap = $$('.database-view');
    self.$databasesList = $('database-list');

    // add events
    self.$databasesList.addEvent('click:relay(a)', function(event, $el)
    {
      var dbName = $el.get('data-name');
      self.cabin_db.selectDatabase(dbName);
    });

    self.$databaseWrap.addEvent('click:relay(button.create-database)', function(event, $el)
    {
      self.newDatabase();
    });
  },

  //
  //  Gets the list of databases
  //
  getDatabases: function()
  {
    var self = this;
    crack.request('a/db_schema/get_databases', {}, {
      success: function(response)
      {
        self.cabin_db.state.databases = response;
        self.cabin_db.renderTopBarControls(response.rows);

        self.databases = response.rows;
        self.renderDatabases(response.rows);
      }
    });
  },

  renderDatabases: function(databases)
  {
    var self = this;

    self.$databasesList.empty();
    self.$databasesList.set('html', templates['templates/database_list']({databases: databases}));
  },

  //
  //  Make a new database
  //
  newDatabase: function()
  {
    var self = this;
    var modal = crack.modal({
      head: 'Create new database',
      body: '<div class="formline"><label>Database name</label><input type="text" id="db-name-field" /></div>',
      footer: [
        {
          type: 'button',
          class: 'button button-primary',
          html: '<i class="icon-plus-circled"></i> Create',
          events: {
            click: function(){
              self.createDatabase($('db-name-field').value, modal);
            }
          }
        }
      ]
    });

    $('db-name-field').focus();
  },

  createDatabase: function(dbName, modal)
  {
    var self = this;
    if(dbName === '')
    {
      return false;
    }

    crack.request('a/db_schema/create_database', {new_db_name: dbName}, {
      success: function(data)
      {
         // update the db state and go to new db
        self.cabin_db.state.databases = data;
        self.cabin_db.selectDatabase(dbName);

        //self.renderDatabases(data.rows);
        modal.close();
      },
      error: function(error)
      {
        crack.alerts.new('error', error);
        modal.close();
      }
    })
  }

});