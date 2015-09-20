angapp.controller('mainController', function($scope, $http, $timeout) {
	$scope.formData = {};
	$scope.name = "bob";
	$scope.showBob = true;
	$scope.isLoggedIn = false;
	$scope.userTab = 0;
	$scope.go = true;
	$scope.ev = {};
	$scope.login = {};
	$scope.userData = {}
	$scope.interests = []
	$scope.categories = ["Sports", "Arts", "Music", "Pset"];

	//hard coded user
	$scope.userData.firstName = "Zach";
	$scope.userData.lastName = "is Hated";
	$scope.userData.username = "zhated@sadface.com";
	$scope.userData.cellNumber = "0000001111";
	$scope.userData.interests = ["Sports", "Music"];
	$scope.userData.attending = ["55fe49a37b8944361b00000a",
        "55fe4abe3219b68507000001"];
	$scope.userData.hosting = ["55fe7428c4a0366f09000002"];

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

	$scope.getAttending = function() {
		console.log("I tried");
		var evs = [];
		$scope.eventObject();
		$timeout(function() {
			console.log($scope.userData.attending);
			for(var i = 0; i<$scope.userData.attending.length; i++) {
				evs.push($scope.eventO[$scope.userData.attending[i]]);
			}
			$scope.attending = evs;
		}, 300);
	}

	$scope.getHosting = function() {
		console.log("I tried");
		var evs = [];
		$scope.hostObject();
		$timeout(function() {
			$scope.hosting = $scope.hostO[$scope.userData.username];
		}, 300);
	}

	$scope.eventObject = function() {
		$scope.getEvents();
		$timeout(function() {
			$scope.eventO = {};
			for(var i = 0; i< $scope.events.length; i++) {
				$scope.eventO[$scope.events[i]["_id"]] = $scope.events[i];
			}
		}, 200)
		
	}

	$scope.hostObject = function() {
		$scope.getEvents();
		$timeout(function() {
			$scope.hostO = {};
			for(var i = 0; i< $scope.events.length; i++) {
				if(!$scope.hostO[$scope.events[i]["host"]]) {
					$scope.hostO[$scope.events[i]["host"]] = [];	
				}
				$scope.hostO[$scope.events[i]["host"]].push($scope.events[i]);
			}
		}, 200)
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
		$scope.getLocationForAddress($scope.ev.address);
		$scope.ev.host = $scope.userData.username;
		
		$timeout(function() {
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
		}, 200);
		$timeout(function() {
			$scope.ev.name = "";
			$scope.ev.category = null;
		}, 300);
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

	$scope.joinEvent = function(id) {
		$scope.userData.attending.push(id);
		$http.post('/api/joinEvent', {id:id,username:$scope.userData.username})
			.then(function(data) {
				console.log("I worked")
			}, function(err) {
				console.log("Error: " + err);
			})
	}

	$scope.hostEvent = function(id) {
		$http.post('/api/hostEvent', {id:id,username:$scope.userData.username})
			.then(function(data) {
				console.log("I worked")
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
				if(!data.data.username) {
					$scope.loginError = true;
					data = {}
					$scope.isLoggedIn = false;
				}
				else {
					$scope.isLoggedIn = true;
					$scope.userData = data.data;
					console.log($scope.userData);
				}
				console.log("Login: " + $scope.isLoggedIn);
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
		var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + mod + "&key=AIzaSyBJRznPmQx7jKwY7sF4Qh_DB-xXt1tN-oM";
		console.log(url);
		$http.get(url, {})
			.then(function(data, err) {
				$scope.ev.address = data.data.results[0].geometry.location
			}, function(err) {
				console.log(err);
			})
	}

	/*$scope.getAttending();
	$scope.getHosting();*/
});