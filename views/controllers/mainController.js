angapp.controller('mainController', function($scope, $http) {
	$scope.formData = {};
	$scope.name = "bob";
	$scope.showBob = true;
	$scope.isLoggedIn = false;

	$scope.toggleBob = function() {
		$scope.showBob = !$scope.showBob;
	}

	// creates a new user
	$scope.createUser = function() {
		console.log("trying to post");
		$http.post('/api/new-user', $scope.formData)
			.success(function(data) {
				console.log("hi");
				// clears the form since we do not need the data anymore
				$scope.formData = {};
				console.log("new user made!");
				console.log(data);
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
		console.log("stuff");
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

	// creates a new account
	$scope.createAccount = function() {
		console.log("I'm doing something");
		//$scope.formData = {};
		/*$scope.formData.username = $scope.newEmail;
		$scope.formData.password = $scope.newPassword;
		$scope.formData.cellNumber = $scope.newCellNumber;*/
		console.log($scope.formData);
		$scope.createUser();
		$scope.newEmail = "";
		$scope.newPassword = "";
		$scope.newCellNumber = "";
		console.log("I don't care")
	}
	$scope.logIn = function() {
		$scope.isLoggedIn = true;
	};

	$scope.logOut = function() {
		$scope.isLoggedIn = false;
	};
});