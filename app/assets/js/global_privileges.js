
var global_privileges = new Class
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
    cabin.request('a/api/v1/db_users/get_global_privileges', {db_name: self.dbName, user_name: self.userName, host: self.host}, {
      success: function(response)
      {
        self.renderPrivileges(response);
      },
      error: function(error)
      {
        cabin.alerts.new('error', error);
      }
    });
  },

  renderPrivileges: function(response)
  {
    var self = this;

    var privileges = self.resolveGlobalPrivileges(response);
  
    // generate the template
    var $body = new Element('div', {
      html: templates['templates/global_privileges_form']({privileges: privileges})
    });

    
    // draw the privileges modal
    self.modal = cabin.modal({
      width: 860,
      head: 'Global privileges for ' + self.userName + '@' + self.host,
      body: $body,
      class: '',
      footer: [
        {
          type: 'button',
          html: '<i class="icon-floppy"></i> Save privileges',
          class: 'button button-primary',
          events: {
            click: function(){
              self.savePrivileges($body);
            }
          }
        }
      ]
    });
  },

  savePrivileges: function($form)
  {
    var self = this;
    var data = {user_name: self.userName, host: self.host};

    var $inputs = $form.getElements('input');
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

    cabin.request('a/api/v1/db_users/save_global_privileges', data, {
      success: function(response)
      {
        self.modal.close();
      },
      error: function(error)
      {
        cabin.alerts.new('error', error);
        self.modal.close();
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
      ],
      max_questions: data.max_questions,
      max_connections: data.max_connections,
      max_updates: data.max_updates,
      max_user_connections: data.max_user_connections      
    };
  }

});