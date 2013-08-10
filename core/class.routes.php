<?php

class routes
{

	function resolve()
	{
		global $vars, $base_route;
		include_once(BASE.'/routes.php');
		

		foreach($routes as $route=>$rock)
		{
			if($vars[0] == $route)
			{
				$base_route = array_shift($vars);
				return($rock);
			}
		}

		// if we get here just return the last item as default
		return(array_pop($routes));
	}

}

?>