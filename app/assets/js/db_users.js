
var db_users = new Class
({
  
  //
  //  Init a few things
  //
  initialize: function(dbName)
  {
    var self = this;

    // our wrapper
    self.$usersWrap = $('db-users');

    // set vars
    self.dbName = dbName;
    
    // get the users
    self.getUsers();

    // add events
    self.$usersWrap.removeEvents();

    self.$usersWrap.addEvent('click:relay(.edit)', function(event, $el)
    {
      var type = $el.get('data-type');
      var userName = $el.get('data-name');
      var host = $el.get('data-host');

      if(type === 'options')
      {
        var userOptions = new user_options(dbName, userName, host);
      }
      else if(type === 'global')
      { 
        var globalPrivileges = new global_privileges(dbName, userName, host);
      }
      else if(type === 'database')
      {
        var dbPrivileges = new db_privileges(dbName, userName, host);
      }
      else if(type === 'drop')
      {
        self.dropUser(dbName, userName, host);
      }
    });

    self.$usersWrap.addEvent('click:relay(button.add-user)', function(event, $el)
    {
      self.renderAddUser();
    });
  },


  //
  //  New user modal
  //
  renderAddUser: function()
  {
    var self = this;
    var $form = new Element('div', {
      html: templates['templates/add_user_form']({})
    });

    // draw the privileges modal
    var modal = crack.modal({
      head: 'Create user',
      body: $form,
      footer: [
        {
          type: 'button',
          html: '<i class="icon-plus-circled"></i> Create user',
          class: 'button button-primary',
          events: {
            click: function(){
              self.addUser($form, modal);
            }
          }
        }
      ]
    });
  },

  addUser: function($form, modal)
  {
    var self = this;

    var data = {
      db_name: self.dbName
    };

    var $fields = $form.getElements('input');
    $fields.each(function($input){
      data[$input.name] = $input.value;
    });

    crack.request('a/db_users/add_user', data, {
      success: function(response)
      {
        self.renderUsers(response);
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
  //
  //
  dropUser: function(dbName, userName, host)
  {
    var self = this;

    var data = {
      db_name: dbName, 
      user_name: userName,
      host: host
    };

    crack.confirm('Are you sure you want to DROP user \'' + userName + '\'@\'' + host + '\'?', function(modal)
    {
      crack.request('a/db_users/drop_user', data, {
      success: function(response)
        {
          modal.close();
          self.renderUsers(response);
        },
        error: function(error)
        {
          modal.close();
          crack.alerts.new('error', error);
        }
      });
    });
  },


  //
  //  Get users list
  //
  getUsers: function()
  {
    var self = this;
    crack.request('a/db_users/get', {db_name: self.dbName}, {
      success: function(response)
      {
        //self.renderLayout();
        self.renderUsers(response);
      },
      error: function(error)
      {
        crack.alerts.new('error', error);
      }
    });
  },

  renderUsers: function(users)
  {
    var self = this;
    self.$usersWrap.set('html', templates['templates/users']({users: users}));
  }

});