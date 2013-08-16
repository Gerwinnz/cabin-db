
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
      crack.confirm('you wanna log in?');
    });
  }

});