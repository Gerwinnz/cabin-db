
var cabin_db = new Class
({
  
  state: false,

  //
  //  Init our basic stuff
  //
  initialize: function()
  {
    var self = this;

    // Cache els
    self.$topBar = $('top-bar');

    // Decode server state
    self.state = JSON.decode(cabin_db_state);

    // Document event app wide
    $(document.body).addEvent('click', function()
    {
      $$('.close-me').removeClass('open');
    });

    // Init app
    if(self.state.current_user === false)
    {
      self.renderLogIn();
    }
    else
    {
      self.logIn(self.state);
      self.renderTopBarControls(self.state.databases.rows);
      self.renderDashboard();
    }
  },

  //
  //  Call when log in occurs
  //
  logIn: function(response)
  {
    var self = this;
  },

  logOut: function()
  {
    var self = this;
    self.$topBar.getElement('.right').empty();
  },


  //
  //  Select a database
  //
  selectDatabase: function(dbName)
  {
    var self = this;
    self.dbName = dbName;
    self.renderTopBarControls(self.state.databases.rows, dbName);
    self.renderDatabase(dbName);
  },

  renderDatabase: function(dbName)
  {
    var self = this;
    var d = new db_database(dbName, self);
  },


  //
  //  Renders the top bar controls when logged in
  //
  renderTopBarControls: function(databases, dbName)
  {
    var self = this;

    // events
    self.$topBar.removeEvents();

    self.$topBar.addEvent('click:relay(.db-name .dropdown-toggle)', function(event, $el)
    {
      event.stopPropagation();
      self.$dropDown.toggleClass('open');
    });

    self.$topBar.addEvent('click:relay(.db-option)', function(event, $el)
    {
      event.stopPropagation();
      self.selectDatabase($el.get('data-name'));
    });

    self.$topBar.addEvent('click:relay(#logo)', function(event, $el)
    {
      self.renderDashboard();
      self.renderTopBarControls(databases);
    });

    self.$topBar.addEvent('click:relay(.db-name-label)', function(event, $el)
    {
      self.renderDatabase(dbName);
    });

    // render it
    var data = {
      current_database: dbName,
      databases: databases
    };

    self.$topBar.getElement('.right').set('html', templates['templates/top_bar_controls'](data));
    self.$dropDown = self.$topBar.getElement('.options');
  },

  //
  //  Our main views
  //
  renderDashboard: function()
  {
    var self = this;
    var d = new dashboard(self);
  },

  renderLogIn: function()
  {
    var self = this;
    var l = new login(self);
  }
});



$(window).addEvent('domready', function()
{
  var app = new cabin_db();
});
