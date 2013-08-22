
var crack = crack || {};

/*
#
#	Our base url
#
*/
crack.baseURL = '/';

$(window).addEvent('domready', function(){
	var baseTag = $$('base');
	if(baseTag[0] !== undefined)
	{
		crack.baseURL = baseTag[0].get('href');
	}
});




/*
#
#
#
*/
crack.request = function(url, data, options) 
{
	url = crack.baseURL + url;

	$('ajax-loading').addClass('display');
	var myRequest = new Request({
	    url: url,
	    method: 'post',
	    data: data,
	    onSuccess: function(response) 
	    {
	    	$('ajax-loading').removeClass('display');

	    	var jsonResponse = JSON.decode(response);

	    	// check status for success or error
	    	if(jsonResponse.status === 'success')
	    	{
	    		if(options.success){
		    		options.success(jsonResponse.pkg);
		    	}
	    	}
	    	else if(jsonResponse.status === 'error')
	    	{
	    		// if it's a caught php error, display it
	    		if(jsonResponse.pkg.error && !options.error)
	        {
	          crack.alerts.new('error', jsonResponse.pkg.error, jsonResponse.pkg.file + ' - Line: ' + jsonResponse.pkg.line);
	          console.log(jsonResponse.pkg);
	        }
		        
	        if(options.error){
		    		options.error(jsonResponse.pkg);
		    	}
	    	}		    	
	    }
	}).send();
};




/*
#
#
#
*/
crack.pluralize = function(string, number)
{
	return number === 1 ? string : string + 's';
}



/*
#
#
#
#
*/
crack.readableBytes = function(bytes) 
{
	bytes = parseInt(bytes);
	if(bytes === 0){ return 0; }
  var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
  var e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e]; 
}




/*
#
#
#
*/
crack.defer = function(callback)
{
	setTimeout(callback, 0);
};





/*
#
#
#
*/
crack.modal = function(options)
{
	var vals = {};
	if(options.head){ vals.head = options.head }
	
	if(options.body){ 
		if(typeof(options.body) === 'string')
		{
			vals.body = options.body;
		}
		else
		{
			vals.body = '';
		}
	}

	var $body = (document.body);
	var $el = new Element('div', {html: templates['templates/modal'](vals)});
	var $overlay = $el.getElement('div.overlay');
	var $modal = $el.getElement('div.modal');

	// if body is an element then adopt it
	if(typeof(options.body) !== 'string')
	{
		$modal.getElement('.body').adopt(options.body);
	}

	// check for width
	if(options.width)
	{
		$modal.setStyle('width', options.width);
	}

	// check for class
	if(options.class)
	{
		$modal.addClass(options.class);
	}

	// generate the footer
	if(options.footer)
	{ 
		var $footer = new Element('div', {class: 'footer clear-fix'});
		options.footer.each(function(elOptions){
			$footer.adopt(new Element(elOptions.type, elOptions));
		});
		$modal.adopt($footer);
	}

	// append to the dom
	$body.adopt($el);

	// open this sucker
	crack.defer(function(){
		$modal.addClass('open');
	});

	// center it
	$modal.setStyle('left', (($body.getSize().x / 2) - ($modal.getSize().x / 2)));

	// callback
	if(options.loaded)
	{
		options.loaded({
			modal: $modal
		});
	}

	// add some events
	$overlay.addEvent('click', function(e){
		if(e.target.className === 'overlay')
		{
			$overlay.destroy();
		}
	});

	// return a simple set of methods
	return {
		close: function(){
			$overlay.destroy();
		}
	}
}



crack.confirm = function(message, success)
{
	var modal = crack.modal({
		head: 'Confirm',
		body: message,
		footer: [
			{
				type: 'button',
				html: '<i class="icon-tick"></i> Yes',
				class: 'button button-primary',
				events: {
					click: function(){
						success(modal);
					}
				}
			},
			{
				type: 'button',
				html: '<i class="icon-cross"></i> No',
				class: 'button button-negative',
				events: {
					click: function(){
						modal.close();
					}
				}
			}
		]
	});
}