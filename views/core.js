// angapp is the angular application
var angapp = angular.module('hackmit2015', ["ngMap"]);

angapp.filter('recSearch', function() {
	return function(input, interests) {
		var output = [];
		for(var j = 0; j < input.length; j++) {
			for (var i = 0; i < interests.length; i++) {
		 		if (input[j].category===interests[i]) {
		      			output.push(input[j]);
		      	}
		    }
		}
	    return output;
	}
});

