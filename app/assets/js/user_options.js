
var user_options = new Class
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
    self.renderOptions();
  },


  //
  //  Render our options modal
  //
  renderOptions: function(response)
  {
    var self = this;
    var $form = new Element('div', {
      html: templates['templates/user_options_form']({})
    });

    // draw the privileges modal
    var modal = cabin.modal({
      head: 'Edit user',
      body: $form,
      footer: [
        {
          type: 'button',
          html: '<i class="icon-floppy"></i> Save',
          class: 'button button-primary',
          events: {
            click: function(){
              self.saveOptions($form, modal);
            }
          }
        }
      ]
    });
  },

  //
  //  Save our options
  //
  saveOptions: function($form, modal)
  {
    var self = this;
    var data = {
      user_name: self.userName, 
      host: self.host
    };

    var $fields = $form.getElements('input');
    $fields.each(function($input){
      data[$input.name] = $input.value;
    });

    cabin.request('a/api/v1/db_users/save_user_options', data, {
      success: function(response)
      {
        cabin.alerts.new('success', response);
        modal.close();
      },
      error: function(error)
      {
        cabin.alerts.new('error', error);
        modal.close();
      }
    });
  }

});