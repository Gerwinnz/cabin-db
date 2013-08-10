<?php


class display
{

	function render()
	{
		global $vars, $config;

		// check for ajax or full request
		if(isset($vars[0]))
		{
			if($vars[0] == 'a')
			{
				return $this->get_ajax_response();
			}
		}
		
      	return $this->get_full_response();
	}


	//
	//	Returns a controllers partial response
	//
	function get_ajax_response()
	{
		global $vars, $config;
		
		set_error_handler("display::get_ajax_error");

		$controller_name = clean($vars[1]);
		$action = clean($vars[2]);

		// include and execute controller
		$controller_path = CONTROLLERS.'/'.$controller_name.'.php';
		if(file_exists($controller_path))
		{
			include_once($controller_path);
			$controller = new $controller_name();
			if(method_exists($controller, $action))
			{
				return $controller->$action($_REQUEST);	
			}
			else
			{
				return format_response('Route end point does not exist', 'error');
			}
		}
	}

	function get_ajax_error($error_number, $error_string, $error_file, $error_line, $error_context)
	{
		$error = array
		(
			'number' 	=> $error_number,
			'error' 	=> $error_string,
			'file' 		=> $error_file,
			'line'		=> $error_line,
			'context'	=> $error_context
		);

		echo format_response($error, 'error');
		die();
	}


	//
	//	Returns a full page request wrapped in a layout
	//
	function get_full_response()
	{
		global $twig, $layout, $output, $assets, $vars, $config;

		// resolve the route and find what controller to use
		$routes = new routes();
		$controller_name = $routes->resolve();

		// include and execute controller
		$controller_path = CONTROLLERS.'/'.$controller_name.'.php';
		if(file_exists($controller_path))
		{
			include_once($controller_path);
			$controller = new $controller_name();
			$output->set('content.main', $controller->index($vars));
		}
		else
		{
			$output->set('content.main', 'Rock "'.$controller_name.'" could not be found.');
		}

		// get the layout and return
		$layout_contents = file_get_contents(LAYOUTS.'/'.$layout.'.html');
		$layout = $twig->loadTemplate($layout_contents);

		return $layout->render($output->get());
	}

}


?>