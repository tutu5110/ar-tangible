'use strict';
var WebSocketServer = require('websocket').server;
var http = require('http');
var portName = 'COM3'; 
var SerialPort = require('serialport');
var unityData = 1;
var serialConnected = false;
var UnityDataReceived = false;
//var serialport = require('serialport');
//
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

var port = new SerialPort(portName);

port.on('open', function() {
    port.update({baudRate:115200});
        port.write('main screen turn on', function(err) {
    if (err) {
       console.log('Error on write: ', err.message);
    } else {
        console.log("Serial is connected! ready to transmit")
        serialConnected = true;
    }

  });
});

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})

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

console.log((new Date()) + ' Connection accepted.');
 
wsServer.on('connect', function (unityConnection) {

    // send one time welcome
    unityConnection.sendUTF(JSON.stringify("Node server is ready! now waiting for COM(SERIAL) connection."));

    unityConnection.on('message', function (message) {
        var data = JSON.parse(message.utf8Data);
        /*
        if(data.gameObject.jointRotation != undefined){
            unityData = parseFloat(data.gameObject.jointRotation.y);
            UnityDataReceived= true;
        } 
        */
        console.log(data.impulse);
    });

    unityConnection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + unityConnection.remoteAddress + ' disconnected.');
    });
});


var t = setInterval(function(){
    if(serialConnected){
        if(UnityDataReceived){
        var finalValue = (unityData /3 ) ;
        finalValue  = finalValue < 105 ? 105 : finalValue;
        finalValue -= 100;
        finalValue *= 5;
        console.log(finalValue);
        port.write(Math.floor(finalValue)+"\n");
        }
    } 
}, 100);