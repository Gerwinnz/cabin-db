
var crack_tabs = new Class
({
	
	//
	//	
	//
	initialize: function($tabsWrap, options)
	{
		var self = this;

		var $panesWrap = $tabsWrap.getNext();
		var $tabs = $tabsWrap.getElements('li');
		var $panes = $panesWrap.getElements('li');

		$panes.each(function($pane){
			$panes[$pane.get('data-tab')] = $pane;
		});

    // add events
  	$tabsWrap.addEvent('click:relay(li)', function(event, $el)
		{
			var tabName = $el.get('data-tab');

			$tabs.removeClass('current');
			$el.addClass('current');

			$panes.removeClass('current');
			$panes[tabName].addClass('current');

			// check for callback option
			if(options[tabName])
			{
				options[tabName]();
			}
		});
	}

});
