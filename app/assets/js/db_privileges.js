
var db_privileges = new Class
({
  
  //
  //  Init a few things
  //
  initialize: function(dbName, userName, host)
  {
    var self = this;

    // set vars
    self.dbName = dbName;
    self.userName = userName;
    self.host = host;

    // render out the modal
    self.getPrivileges();
  },



  //
  //  Fetch database privileges for a user
  //
  getPrivileges: function()
  {
    var self = this;
    crack.request('a/db_users/get_database_privileges', {db_name: self.dbName, user_name: self.userName, host: self.host}, {
      success: function(response)
      {
        self.renderPrivileges(response);
      },
      error: function(error)
      {
        crack.alerts.new('error', error);
      }
    });
  },

  renderPrivileges: function(response)
  {
    var self = this;

    // pre process our data
    var databases = [];
    response.each(function(db)
    {
      var currentTab = self.currentDbTab === undefined ? self.dbName : self.currentDbTab;
      var dbName = db.Db.replace(/\\_/g, '_')
      var className = dbName === currentTab ? 'active' : '';
      databases.push({
        db_name: dbName,
        class: className,
        privileges: self.resolveDatabasePrivileges(db)
      });
    });
  
    // generate the template
    var $body = new Element('div', {
      html: templates['templates/privileges_form']({databases: databases})
    });

    // some basic events
    var $dbPrivileges = $body.getElements('.db-privileges-form');
    var $dbListItems = $body.getElements('li.db');

    $body.addEvent('click:relay(li.db)', function(event, $el)
    {
      var dbName = $el.get('data-name');

      self.currentDbTab = dbName;

      $dbListItems.removeClass('active');
      $dbPrivileges.removeClass('active');

      $el.addClass('active');
      $dbPrivileges.each(function($el)
      {
        if($el.get('data-name') === dbName)
        {
          self.currentDbPrivilegesForm = $el;
          $el.addClass('active');
        }
      });
    });

    $body.addEvent('click:relay(li.add-database)', function(event, $el)
    {
      self.selectDatabase();
    });

    $body.addEvent('click:relay(a.revoke)', function(event, $el)
    {
      var dbName = $el.get('data-name');
      self.revokePrivileges(dbName);
    });

    // draw the privileges modal
    self.modal = crack.modal({
      width: 780,
      head: 'Database specific privileges for ' + self.userName + '@' + self.host,
      body: $body,
      class: 'privileges-modal',
      footer: [
        {
          type: 'button',
          html: '<i class="icon-floppy"></i> Save privileges',
          class: 'button button-primary',
          events: {
            click: function(){
              self.savePrivileges(self.currentDbTab);
            }
          }
        }
      ]
    });
  },

  savePrivileges: function(dbName)
  {
    var self = this;

    var data = {
      db_name: dbName, 
      user_name: self.userName, 
      host: self.host
    };
    
    var $checkboxes = self.currentDbPrivilegesForm.getElements('input');
    $checkboxes.each(function($checkbox)
    {
      data[$checkbox.get('name')] = $checkbox.checked;
    });
    

    crack.request('a/db_users/save_privileges', data, {
      success: function(response)
      {
        
      },
      error: function(error)
      {
        crack.alerts.new('error', error);
      }
    });
  },



  revokePrivileges: function(dbName)
  {
    var self = this;

    crack.request('a/db_users/revoke_database', {db_name: dbName, user_name: self.userName, host: self.host}, {
      success: function(response)
      {
        self.currentDbTab = undefined;
        self.modal.close();
        self.renderPrivileges(response);
      }
    });
  },




  //
  //  Show's the add database dropdown in a modal
  //
  selectDatabase: function()
  {
    var self = this;

    crack.request('a/db_schema/get_databases', {}, {
      success: function(response)
      {
        var modal = crack.modal({
          head: 'Add database to ' + self.userName + '@' + self.host,
          body: templates['templates/add_database_form']({databases: response.rows}),
          footer: [
            {
              type: 'button',
              html: '<i class="icon-plus-circled"></i> Add database',
              class: 'button button-primary',
              events: {
                click: function(){
                  self.addDatabase($('add-db-field').value, modal);
                }
              }
            }
          ]
        });
      }
    });
  },

  addDatabase: function(dbName, modal)
  {
    var self = this;
    crack.request('a/db_users/add_database', {db_name: dbName, user_name: self.userName, host: self.host}, {
      success: function(response)
      {
        modal.close();
        self.modal.close();
        self.renderPrivileges(response);
      },
      error: function(error)
      {
        crack.alerts.new('error', error);
      }
    });
  },




  //
  //  Resolves the server returned privileges
  //
  resolveDatabasePrivileges: function(data)
  {
    var self = this;
    
    return {
      data: [
        {name: 'select_priv', label: 'SELECT', value: data.Select_priv},
        {name: 'insert_priv', label: 'INSERT', value: data.Insert_priv},
        {name: 'update_priv', label: 'UPDATE', value: data.Update_priv},
        {name: 'delete_priv', label: 'DELETE', value: data.Delete_priv}
      ],
      structure: [
        {name: 'create_priv', label: 'CREATE', value: data.Create_priv},
        {name: 'alter_priv', label: 'ALTER', value: data.Alter_priv},
        {name: 'index_priv', label: 'INDEX', value: data.Index_priv},
        {name: 'drop_priv', label: 'DROP', value: data.Drop_priv},
        {name: 'create_tmp_table_priv', label: 'CREATE TEMPORARY TABLES', value: data.Create_tmp_table_priv},
        {name: 'show_view_priv', label: 'SHOW VIEW', value: data.Show_view_priv},
        {name: 'create_routine_priv', label: 'CREATE ROUTINE', value: data.Create_routine_priv},
        {name: 'alter_routine_priv', label: 'ALTER ROUTINE', value: data.Alter_routine_priv},
        {name: 'execute_priv', label: 'EXECUTE', value: data.Execute_priv},
        {name: 'create_view_priv', label: 'CREATE VIEW', value: data.Create_view_priv},
        {name: 'event_priv', label: 'EVENT', value: data.Event_priv},
        {name: 'trigger_priv', label: 'TRIGGER', value: data.Trigger_priv}
      ],
      administration: [
        {name: 'grant_priv', label: 'GRANT', value: data.Grant_priv},
        {name: 'lock_tables_priv', label: 'LOCK TABLES', value: data.Lock_tables_priv},
        {name: 'references_priv', label: 'REFERENCES', value: data.References_priv}
      ]
    };
  }

});