#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var net = require('net');
var SV_COUNTER = 0;
    var client = new net.Socket();
var rawdata = "test_data";
var data = {};
var Unityconnection
var obj = {};
var wsConnectionEstablished = false;
unityReady = false;


var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});


wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production 
    // applications, as it defeats all standard cross-origin protection 
    // facilities built into the protocol and the browser.  You should 
    // *always* verify the Unityconnection's origin and decide whether or not 
    // to accept it. 
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed. 
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin 
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
     //Unityconnection.sendUTF(JSON.stringify(obj));

    Unityconnection = request.accept( request.origin);
    console.log((new Date()) + ' Connection accepted.');

    Unityconnection.on('message', function(message) {
        // establishing connection
        if(!wsConnectionEstablished){
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data + ", unity is ready!!!");
                unityReady = true;
                Unityconnection.sendUTF("Server is ready, preparing to receive hand-data");
                // windowTimer = setInterval(function(){connection.sendUTF("Counting..."+SV_COUNTER)}, 1000);
             
            }   else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                Unityconnection.sendBytes(message.binaryData);
            }
            wsConnectionEstablished = true;
        } else {
        // connection established!
        console.log("received: " + message.utf8Data + " " + SV_COUNTER);
        Unityconnection.sendUTF(JSON.stringify("got it!"));
        SV_COUNTER++;
        }

    });

    Unityconnection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + Unityconnection.remoteAddress + ' disconnected.');
        wsConnectionEstablished = false;
    });
});