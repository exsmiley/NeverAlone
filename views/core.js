// angapp is the angular application
var angapp = angular.module('hackmit2015', ["ngMap"]);

angapp.filter('interestFilter', function() {
	return function(input, interests) {
		var output = [];
		console.log(input);
		console.log(interests);
		for (var i = 0; i < interests.length; i++) {
	 		if (input.category===interests[i]) {
	      			output.push(input);
	      	}
	    }
	    return output;
	}
});

