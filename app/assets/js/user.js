
var user = new Class
({
  
  //
  //  Init a few things
  //
  initialize: function(dbName, userName, host)
  {
    var self = this;

    // set for future
    self.dbName = dbName;
    self.userName = userName;
    self.host = host;

    // define selectors
    self.$contentPane = $('content-pane');

    // fetch the base html
    self.$contentPane.set('html', templates['crack/templates/user']({user_name: userName}));

    self.$userGlobal = self.$contentPane.getElement('#user_global');
    self.$userSpecific = self.$contentPane.getElement('#user_specific');
    self.$userOptions = self.$contentPane.getElement('#user_options');

    // init tabs
    var tabs = new crack_tabs(self.$contentPane.getElement('.tabs'), {
      global: function(){
        
      },
      specific: function(){
        
      },
      options: function(){
        
      }
    });

    //  Events
    self.$userSpecific.addEvent('click:relay(button.add-database)', function(event, $el)
    {
      self.selectDatabase();
    });

    self.$userSpecific.addEvent('click:relay(button.edit-row)', function(event, $el)
    {
      var dbName = $el.get('data-db');
      self.editDatabasePrivileges(dbName);
    });

    self.$userSpecific.addEvent('click:relay(button.delete-row)', function(event, $el)
    {
      var dbName = $el.get('data-db');
      self.revokeDatabasePrivileges(dbName);
    });

    self.$userGlobal.addEvent('click:relay(button.save-global)', function(event, $el)
    {
      self.saveGlobalPrivileges();
    });

    // init with the content
    self.getUser();
  },


  //
  //  Gets a user's privileges
  //
  getUser: function()
  {
    var self = this;
    crack.request('a/db_users/get_user', {db_name: self.dbName, user_name: self.userName, host: self.host}, {
      success: function(response)
      {
        self.renderUser(response);
      },
      error: function(error)
      {
        crack.alerts.new('error', error);
      }
    });
  },

  renderUser: function(response)
  {
    var self = this;

    // store db specific privileges here
    self.privileges = {};

    // resolve and render global privileges
    var globalPrivileges = self.resolveGlobalPrivileges(response.global_privileges);
    globalPrivileges['max_questions'] = response.global_privileges.max_questions;
    globalPrivileges['max_connections'] = response.global_privileges.max_connections;
    globalPrivileges['max_updates'] = response.global_privileges.max_updates;
    globalPrivileges['max_user_connections'] = response.global_privileges.max_user_connections;
    
    self.$userGlobal.set('html', templates['crack/templates/user_global']({privileges: globalPrivileges}));

    // render table of databases and resolve privileges
    var databases = [];
    response.specific_privileges.each(function(db)
    {
      databases.push({
        db_name: db.Db
      });

      self.privileges[db.Db] = self.resolveDatabasePrivileges(db);
    });
    self.$userSpecific.set('html', templates['crack/templates/user_specific']({databases: databases}));
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
          body: templates['crack/templates/add_database_form']({databases: response.rows}),
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
        self.renderUser(response);
        self.editDatabasePrivileges(dbName);
      }
    });
  },



  //
  //  Edit and revoke user db privileges
  //
  editDatabasePrivileges: function(dbName)
  {
    var self = this;
    var $template = new Element('div', {html: templates['crack/templates/privileges_form']({privileges: self.privileges[dbName]})});
    var $checkboxes = $template.getElements('input');

    var modal = crack.modal({
      width: 580,
      head: 'Privileges for ' + self.userName + '@' + self.host + ' on ' + dbName,
      body: $template,
      footer: [
        {
          type: 'button',
          html: '<i class="icon-floppy"></i> Save privileges',
          class: 'button button-primary',
          events: {
            click: function(){
              var data = {db_name: dbName, user_name: self.userName, host: self.host};
              $checkboxes.each(function($checkbox)
              {
                data[$checkbox.get('name')] = $checkbox.checked;
              });
              
              crack.request('a/db_users/save_privileges', data, {
                success: function(response)
                {
                  modal.close();
                  self.renderUser(response);
                },
                error: function(error)
                {
                  crack.alerts.new('error', error);
                }
              });
            }
          }
        }
      ]
    });
  },

  revokeDatabasePrivileges: function(dbName, modal)
  {
    var self = this;
    crack.confirm('Are you sure you want to REVOKE all permissions for ' + self.userName + '@' + self.host + ' on ' + dbName + '?', function(modal)
    {
      crack.request('a/db_users/revoke_database', {db_name: dbName, user_name: self.userName, host: self.host}, {
        success: function(response)
        {
          modal.close();
          self.renderUser(response);
        },
        error: function(error)
        {
          crack.alerts.new('error', error);
        }
      }); 
    });
  },


  //
  //  Save global privileges
  //
  saveGlobalPrivileges: function()
  {
    var self = this;
    var data = {user_name: self.userName, host: self.host};

    var $inputs = self.$userGlobal.getElements('input');
    $inputs.each(function($input)
    {
      if($input.get('type') === 'checkbox')
      {
        data[$input.get('name')] = $input.checked;
      }
      else
      {
        data[$input.get('name')] = $input.value;
      }
    });

    crack.request('a/db_users/save_global_privileges', data, {
      success: function(response)
      {
        self.renderUser(response);
      },
      error: function(error)
      {
        crack.alerts.new('error', error);
      }
    }); 
  },



  //
  //  Return formated privileges
  //
  resolveGlobalPrivileges: function(data)
  {
    var self = this;
    
    return {
      data: [
        {name: 'select_priv', label: 'SELECT', value: data.Select_priv},
        {name: 'insert_priv', label: 'INSERT', value: data.Insert_priv},
        {name: 'update_priv', label: 'UPDATE', value: data.Update_priv},
        {name: 'delete_priv', label: 'DELETE', value: data.Delete_priv},
        {name: 'file_priv', label: 'FILE', value: data.File_priv}
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
        {name: 'super_priv', label: 'SUPER', value: data.Super_priv},
        {name: 'process_priv', label: 'PROCESS', value: data.Process_priv},
        {name: 'reload_priv', label: 'RELOAD', value: data.Reload_priv},
        {name: 'shutdown_priv', label: 'SHUTDOWN', value: data.Shutdown_priv},
        {name: 'show_db_priv', label: 'SHOW DATABASES', value: data.Show_db_priv},
        {name: 'lock_tables_priv', label: 'LOCK TABLES', value: data.Lock_tables_priv},
        {name: 'references_priv', label: 'REFERENCES', value: data.References_priv},
        {name: 'repl_client_priv', label: 'REPLICATION CLIENT', value: data.Repl_client_priv},
        {name: 'repl_slave_priv', label: 'REPLICATION SLAVE', value: data.Repl_slave_priv},
        {name: 'create_user_priv', label: 'CREATE USER', value: data.Create_user_priv}
      ]
    };
  },


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
