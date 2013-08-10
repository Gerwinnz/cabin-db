
var crack = crack || {};


/*
#
#	Crack alerts
#
*/
crack.alerts = {
	
	new: function(type, title, detail)
	{
		if(type === undefined){ return false; }

		var data = {
			type: type,
			title: title,
			detail: detail
		};

		var $el = new Element('div', {html: templates['templates/alert'](data)});
		$('alerts-wrap').adopt($el);

		var slideFx = new Fx.Slide($el, {duration: 200}).hide().slideIn();
		$el.addEvent('click', function()
		{
			slideFx.slideOut().chain(function()
			{
				$el.destroy();
			});
		});
	},

	clear: function()
	{

	}

};