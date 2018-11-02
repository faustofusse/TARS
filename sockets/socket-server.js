var WebSocketServer = require('websocket').server;
var http = require('http');

var PORT = 8080;

var server = http.createServer();
server.listen(PORT, function () {
  console.log('Socket server listening on port ' + PORT + '....');
});

var wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', function (request) {

  var connection = request.accept('arduino', request.origin);
  console.log('Connection accepted.');

  connection.on('message', function (message) {
    console.log('Received message: '+message);
  });

  connection.on('close', function (reasonCode, description) {
    console.log('Socket ' + connection.remoteAddress + ' disconnected.');
  });
});

module.exports = wsServer;