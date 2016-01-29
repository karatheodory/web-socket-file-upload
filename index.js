'use strict';

const Express = require('express');
const Http = require('http');
const WebSocketServer = require('ws').Server;

const WSClient = require('./WSClient');
const WSController = require('./WSController');

const PORT = 8000;

const httpServer = Http.createServer();
const app = new Express();
const webSocketServer = new WebSocketServer({
    server: httpServer
});
const wsController = new WSController();

wsController.addWebSocketServerCallbacks(webSocketServer);
httpServer.on('request', app);
httpServer.listen(PORT, function() {
    const host = httpServer.address().address;
    const port = httpServer.address().port;

    console.log('The server is started on http://%s:%s', host, port);
    const wsClient = new WSClient();
    wsClient.connect(host, port);
    setTimeout(() => wsClient.uploadFile(__dirname + '/package.json'), 1000);
});
