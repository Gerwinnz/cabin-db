
var login = new Class
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
    $('app').set('html', templates['templates/login']());

    // cache els
    self.$loginWrap = $('login-wrap');
    
    // add events
    self.$loginWrap.addEvent('submit:relay(#log-in-form)', function(event, $el)
    {
      event.preventDefault();
      self.logIn($el);
    });

    $('login-username').focus();
  },


  //
  //  Log the user in
  // 
  logIn: function($form)
  {
    var self = this;

    var data = {};
    $form.getElements('input').each(function($input){
      data[$input.get('name')] = $input.value;
    });

    cabin.request('a/api/v1/auth/log_in', data, {
      success: function(response)
      {
        self.cabin_db.state.current_user = true;
        self.cabin_db.renderDashboard();
      },
      error: function(error)
      {
        cabin.alerts.new('error', 'Access denied for \'' + data['db_username'] + '\'@\'localhost\'');
        $('login-username').focus();
      }
    });
  }

});