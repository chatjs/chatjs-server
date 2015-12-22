var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server); 
var path = require('path');

var messages = [];
var users = [];

// Enables CORS
var enableCORS = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, *');

	// intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};

app.use(enableCORS);

var storeMessage = function(name, data){
	messages.push({name:name,text:data});
	if(messages.length > 10){
		messages.shift();
	}
};

var storeUsers = function(name){
	users.push(name);
};

app.get('/',function(request,response){
	response.sendFile("index.html");
});


io.on('connection',function(client){
	console.log(JSON.stringify(JSON.stringify(client)))
});


server.listen(8000);

console.log('listening on 8000');




