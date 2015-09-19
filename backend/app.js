var express = require('express');
var app = express();
var path = require('path');

app.get("/", function(req, res) {
	console.log("I'm trying to send a webpage");
	res.sendFile(path.join(__dirname+'/../views/index.html'));
});

var server = app.listen(3000, function() {
	/*var host = server.address().address;
	var port = server.address().port;*/

	console.log("Forever Alone is online at port: 3000");
})