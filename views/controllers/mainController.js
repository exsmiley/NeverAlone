angapp.controller('mainController', function($scope, $http, $timeout) {
	$scope.formData = {};
	$scope.name = "bob";
	$scope.showBob = true;
	$scope.isLoggedIn = true;
	$scope.userTab = 0;
	$scope.go = true;
	$scope.ev = {};
	$scope.login = {};
	$scope.userData = {}
	$scope.categories = ["Sports", "Arts", "Music", "Pset"];

	//hard coded user
	$scope.userData.firstName = "Zach";
	$scope.userData.lastName = "is Hated";
	$scope.userData.username = "zhated@sadface.com";
	$scope.userData.cellNumber = "0000001111";
	$scope.userData.interests = ["Sports"];
	$scope.userData.attending = [];
	$scope.userData.hosting = [];

	//this makes the google map load then hide
	$timeout(function() {
		$scope.go = false;
	}, 100);

	$scope.toggleBob = function() {
		$scope.showBob = !$scope.showBob;
	}

	$scope.isUserTab = function(number) {
		if($scope.userTab === number) {
			return 'active';
		}
		else {
			return "nope";
		}
	}


	$scope.clickUserTab = function(number) {
		$scope.userTab = number;
	}

	$scope.setCategory = function(cat) {
		$scope.ev.category = cat;
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

	// creates a new Event
	$scope.createEvent = function() {
		$http.post('/api/new-event', $scope.ev)
			.success(function(data) {
				// clears the form since we do not need the data anymore
				$scope.ev = {};
				console.log("new event made!");
				return true
			})
			.error(function(data) {
				console.log("Error: " + data);
				return false
			});
		$scope.ev.name = "";
		$scope.ev.category = null;
	}

	//loads all of the events
	$scope.getEvents = function() {
		$http.get('/api/events', {})
			.then(function(data) {
				$scope.events = data.data;
			}, function(err) {
				console.log("Error: " + err);
			})
	}

	// creates a new account
	$scope.createAccount = function() {
		$scope.createUser();
		$scope.newEmail = "";
		$scope.newPassword = "";
		$scope.newCellNumber = "";
	}

	$scope.logIn = function() {
		console.log("work");
		$http.post('/api/login', $scope.login)
			.then(function(data) {
				$scope.login = {};
				if(!data) {
					$scope.loginError = true;
					data = {}
					data.data = false;
				}
				$scope.isLoggedIn = data.data;
				console.log("Login: " + data.data);
				if($scope.isLoggedIn) {
					$scope.loginError = false;
				}
			}, function(err) {
				$scope.isLoggedIn = false;
			});
		if(!$scope.isLoggedIn) {
			$scope.loginError = true;
			console.log($scope.loginError);
		}
	};

	$scope.logOut = function() {
		$scope.isLoggedIn = false;
	};

	$scope.getLocationForAddress = function(address) {
		var mod = address.replace(" ", "+");
		$http.get("https://maps.googleapis.com/maps/api/geocode/json?" + mod + "&key=AIzaSyBJRznPmQx7jKwY7sF4Qh_DB-xXt1tN-oM")
			.then(function(data) {
				console.log(data);
			}, function(err) {
				console.log(err);
			})
	}
});