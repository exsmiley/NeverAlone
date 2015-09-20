// set up
var express = require('express');
var app = express();
var path = require('path');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var morgan = require('morgan');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSession = require("express-session");
var cookieParser = require("cookie-parser");
app.use(expressSession({secret:'derp'}));

mongoose.connect('mongodb://me:you@ds051553.mongolab.com:51553/fun', function(err) {
	if(err)
		console.log(err);
});

console.log(mongoose.connection.readyState);

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// model for users
var User = mongoose.model('User', {
	username: String, // username will just be the email of the person
	firstName: String,
	lastName: String,
	password: String,
	cellNumber: String,
	interests: Array
});

var Event = mongoose.model('Event', {
	name: String,
	category: String,
	time: String,
	date: String,
	description: String,
});

// API!!!!
// returns all of the users... probably won't want this to always be a thing unless you're an admin
app.get('/api/users', function(req, res) {
	User.find(function(err, users) {
		if(err) {
			res.send(err);
		}
		res.json(users);
	});
});

// create a user and send back his info
app.post('/api/new-user', function(req, res) {
	console.log("I am trying to make a new user");
	//creates a user, info comes from AJAX request from Angular
	console.log(req.body);
	User.create({
		username: req.body.username,
		password: req.body.password,
		cellNumber: req.body.cellNumber
	}, function(err, user) {
		if(err) {
			res.send(err);
		}
	});

});

// delete a user... not sure if necessary
app.delete('/api/users/:user_id', function(req, res) {
	User.remove({
		_id: req.params.user_id
	}, function(err, user) {
		if(err) {
			res.send(err);
		}
		//should be deleted now
	});
});

// create a user and send back his info
app.post('/api/new-event', function(req, res) {
	console.log("I am trying to make a new event");
	//creates a user, info comes from AJAX request from Angular
	console.log(req.body);
	Event.create({
		name: req.body.name,
		category: req.body.category,
		time: req.body.time,
		date: req.body.date,
		description: req.body.description
	}, function(err, events) {
		if(err) {
			res.send(err);
		}
	});

});

// tells us if the user is logged in
app.get('/api/loggedin', function(req, res) {
	if(req.session.username) {
		res.send(true);
	}
	res.send(false);
});

// logs in the user
app.post('/api/login', function(req, res) {
	console.log('got a post');
	//res.send(true);
	User.find({username: req.body.username}, function(err, user) {
		console.log(req.body);
		if(user&&user[0]) {
			console.log(user[0].password);
			console.log(req.body.password);
			if(user[0].password === req.body.password) {
				console.log("same")
				req.session.username = user[0].username;
				res.send(true);
			}
			else {
				console.log("other")
				res.send(false);
			}
		}
		
	})
	//res.send(false);
})

app.get('/api/events', function(req, res) {
	Event.find(function(err, events) {
		if(err) {
			res.send(err);
		}
		res.json(events);
	});
});

//used for loading the homepage
app.get("/", function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/index.html'));
});

//send scripts we need?
app.get('/core.js', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/core.js'));
});

app.get('/mainController.js', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/controllers/mainController.js'));
});

app.get('/navbarDirective.js', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/directives/navbarDirective.js'));
})

app.get('/map', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/directives/ng-map.js'));
});

app.get('/logger', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/angularLogger.js'));
});

//send html templates
app.get('/navbar', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/navbar.html'));
})

app.get('/signinDirective.js', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/directives/signinDirective.js'));
});

app.get('/angular', function(req, res) {
	res.sendfile("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js");
});

app.get('/signin', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/signin.html'));
})


app.get('/homeMainDirective.js', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/directives/homeMainDirective.js'));
})

app.get('/homeMain', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/homeMain.html'));
})

app.get('/profileDirective.js', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/directives/profileDirective.js'));
})

app.get('/profile', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/profile.html'));
})

app.get('/createEventDirective.js', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/directives/createEventDirective.js'));
})

app.get('/createEvent', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/createEvent.html'));
})

app.get('/searchResultDirective.js', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/directives/searchResultDirective.js'));
})

//send html templates
app.get('/searchResult', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/searchResult.html'));
})

app.get('/stylesheet', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/stylesheet.css'));
})

app.get('/styleProfile', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/styleProfile.css'));
})

var server = app.listen(process.env.PORT || 3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Forever Alone is online at port: " + port);
})