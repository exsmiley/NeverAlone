angapp.controller('mainController', function($scope, $http) {
	$scope.formData = {};
	$scope.name = "bob";
	$scope.showBob = true;

	$scope.toggleBob = function() {
		$scope.showBob = !$scope.showBob;
	}

	// creates a new user
	$scope.createUser = function() {
		$http.post('/api/new-user', $scope.formData)
			.success(function(data) {
				// clears the form since we do not need the data anymore
				$scope.formData = {};
				console.log("new user made!");
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};

	// deletes a user after checking it
	$scope.deleteUser = function(id) {
		$http.delete('/api/users/' + id)
			.success(function(data) {
				console.log("I deleted something");
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};
});