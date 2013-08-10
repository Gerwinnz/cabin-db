


//
//	option generates option html and adds the selected attribute if matched
//
Handlebars.registerHelper('option', function(value)
{
	var title = '';
	var optionValue = '';

	if(this.value !== undefined)
	{
		optionValue = this.value;
		if(this.title !== undefined)
		{
			title = 'title="' + this.title + '"';
		}
	}
	else
	{
		optionValue = this;
	}

	// check selected
	if(value !== null && value !== undefined)
	{
		var selected = value.toLowerCase() === (optionValue.toString()).toLowerCase() ? 'selected="selected"' : '';	
	}
  
  return '<option ' + title + ' value="' + optionValue + '" ' + selected + '>' + optionValue + '</option>';
});



//
//	renders an input checkbox with an id/name and a checked status
//
Handlebars.registerHelper('permission_checkbox', function()
{
	var checked = this.value === 'Y' ? 'checked="checked"' : '';
  return '<input type="checkbox" id="' + this.name + '-field" name="' + this.name + '" ' + checked + '/>';
});
