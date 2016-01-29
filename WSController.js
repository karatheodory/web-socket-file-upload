'use strict';

const fs = require('fs');

class WSController {
    constructor() {}

    addWebSocketServerCallbacks(wsServer) {
        wsServer.on('connection', (clientWebSocket) => {
            console.log('WS client connected');
            this._handleClientConnection(clientWebSocket);
        });
    }

    _handleClientConnection(clientWebSocket) {
        const binaryData = [];
        clientWebSocket.on('message', (message, flags) => {
            // flags.binary will be set if a binary data is received.
            // flags.masked will be set if the data was masked.
            console.log('Client message received');
            if (flags.binary) {
                console.log('binary data');
                binaryData.push(flags.buffer);
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
            const totalData = Buffer.concat(binaryData);
            fs.writeFileSync('result.bin', totalData);
        });
    }
}

module.exports = WSController;
