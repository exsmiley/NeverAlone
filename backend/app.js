// set up
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");


//configuration taken from https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
mongoose.connect("mongodb://hacker:derp@apollo.modulusmongo.net:27017/Wi4ryzup")

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// model for users
var user = mongoose.model('user', {
	username: String, // username will just be the email of the person
	password: String
});

// API!!!!
// returns all of the users... probably won't want this to always be a thing unless you're an admin
app.get('/api/users', function(req, res) {
	user.find(function(err, users) {
		if(err) {
			res.send(err);
		}
		res.json(users);
	})
})

// create a user and send back his info
app.post('/api/new-user', function(req, res) {
	//creates a user, info comes from AJAX request from Angular
	user.create({
		username: req.body.username,
		password: req.body.password,
		done: false
	}, function(err, user) {
		if(err) {
			res.send(err);
		}
		//returns the user after you create it
		user.find(function(err, user) {
			if(err) {
				res.send(err);
			}
			res.json(user);
		});
	});
});

// delete a user... not sure if necessary
app.delete('/api/users/:user_id', function(req, res) {
	user.remove({
		_id: req.params.user_id
	}, function(err, user) {
		if(err) {
			res.send(err);
		}
		//should be deleted now
	});
});

//used for loading the homepage
app.get("/", function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/index.html'));
});

var server = app.listen(process.env.PORT || 3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Forever Alone is online at port: " + port);
})