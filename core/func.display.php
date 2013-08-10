<?php


//
//	Find a view and return it
//	
//	Will check for a model and send the model to the view, if not the data that
// 	is send in the data param will be passed to the view
//
function view($path, $data = false)
{
	global $twig, $base_route;

	// check if model exists
	$model_file = MODELS.'/'.$path.'.php';
	if(is_file($model_file))
	{
		include_once($model_file);

		$model_name = str_replace('/','_', $path);
		$model_class_name = "model_".$model_name;
		$model = new $model_class_name($data);
		
		$data = $model->get();
	}
	else
	{
		$data = is_array($data) ? $data : array();
	}
	
	$data['base_route'] = $base_route;

	// fetch the view
	$view_path = VIEWS.'/'.$path.'.html';
	$view_contents = file_get_contents($view_path);

	// render view
	$template = $twig->loadTemplate($view_contents);
	return $template->render($data);
}


//
//	Change the layout
//
function layout($layout_name)
{
	global $layout;
	$layout = $layout_name;
}

?>