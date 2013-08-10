<?php

class routes
{

	function resolve()
	{
		global $vars, $base_route;
		include_once(BASE.'/routes.php');
		
		if(isset($vars[0]))
		{
			foreach($routes as $route=>$controller)
			{
				if($vars[0] == $route)
				{
					$base_route = array_shift($vars);
					return($controller);
				}
			}	
		}
		

		// if we get here just return the last item as default
		return(array_pop($routes));
	}

}

?>