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


//configuration taken from https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
/*mongoose.createConnection('mongodb://data:data@jello.modulusmongo.net:27017/j6iqUjid', function(err) {
	console.log(err);
});*/
mongoose.connect('mongodb://me:you@ds051553.mongolab.com:51553/fun', function(err) {
	console.log(err);
});

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// model for users
var userSchema = new Schema({
	username: String, // username will just be the email of the person
	password: String,
	cellNumber: String
});

var User = mongoose.model('User', userSchema);

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
	var newUser = User({
		username: req.body.username,
		password: req.body.password,
		cellNumber: req.body.cellNumber
	});

	newUser.save(function(err) {
		if(err) throw err;
		console.log("Created a user!");
		res.send(newUser);
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

app.get('/signinDirective.js', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/directives/signinDirective.js'));
});

app.get('/angular', function(req, res) {
	res.sendfile("https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js");
});

//send html templates
app.get('/signin', function(req, res) {
	res.sendfile(path.join(__dirname+'/../views/signin.html'));
})

var server = app.listen(process.env.PORT || 3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Forever Alone is online at port: " + port);
})