var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server); 
var path = require('path');
var url = require('url');
var port = process.env.PORT || 8000;

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
app.use(express.static(__dirname + '/../client/'));
console.log(__dirname + '/../client/')
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



io.on('connection',onSocketConnection);

// New socket connection
function onSocketConnection(client) {
	
	console.log("New user has connected: "+client.id);

	// Attach event listeners
	client.on("disconnect", onClientDisconnect);
	client.on("namespaceConnect", onNamespaceConnect);
	client.on("messageOut",onMessageReceive);
};

function onNamespaceConnect(ns){
	var nsp = io.of('/' + ns);
}

function onMessageReceive(message){
    var nsp = message.nsp;
    var id = this.id.replace('/#','');
    io.of(nsp).emit("messageIn",{text:message.text,source:id});
}

// Socket client has disconnected
function onClientDisconnect() {
	console.log("Client has disconnected: "+this.id);
	var nsp = url.parse(this.handshake.headers.origin).hostname;
	// Broadcast removed player to connected socket clients
	io.of(nsp).emit("userLeft",{id: this.id});
};



server.listen(port);

console.log('listening on port');




