'use strict';

class WSController {
    constructor() {}

    addWebSocketServerCallbacks(wsServer) {
        wsServer.on('connection', (clientWebSocket) => {
            console.log('WS client connected');
            this._handleClientConnection(clientWebSocket);
        });
    }

    _handleClientConnection(clientWebSocket) {
        clientWebSocket.on('message', (message, flags) => {
            // flags.binary will be set if a binary data is received.
            // flags.masked will be set if the data was masked.
            console.log('Client message received');
            if (flags.binary) {
                console.log('binary data');
            } else {
                const obj = JSON.parse(message);
                console.log('string data', JSON.stringify(obj, null, 2));
            }
        });

        clientWebSocket.on('error', (error) => {
            console.log('Error in client web socket: ' + JSON.stringify(error));
        });

        clientWebSocket.on('close', () => {
            console.log('WS client disconnected');
        });
    }
}

module.exports = WSController;
