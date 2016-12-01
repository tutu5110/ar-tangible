'use strict';
var WebSocketServer = require('websocket').server;
var http = require('http');

//var serialport = require('serialport');
//var portName = '/dev/tty.usbmodem1411'; // TODO: change the portname
//var sp = new serialport.SerialPort(portName, {
//    baudRate: 9600,
//    dataBits: 8,
//    parity: 'none',
//    stopBits: 1,
//    flowControl: false,
//    parser: serialport.parsers.readline("\r\n")
//}); // TODO: test the config
//sp.on('data', function (input) {
//    console.log(input);
//});

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});
 
wsServer.on('connect', function (unityConnection) {
    console.log((new Date()) + ' Connection accepted.');

    unityConnection.on('message', function (message) {
        var data = JSON.parse(message.utf8Data);
        console.log(data);
        
        // TODO: send JSON to Arduino
        //sp.write(data.relativeVelocity.x);
    });


    unityConnection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + unityConnection.remoteAddress + ' disconnected.');
    });
});