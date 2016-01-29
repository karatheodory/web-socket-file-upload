'use strict';

const fs = require('fs');
const path = require('path');
const async = require('async');
const WebSocketClient = require('ws');

class WSClient {
    uploadFile(filePath, callback) {
        if (!this.socket) {
            throw new Error('Socket is disconnected');
        }

        async.waterfall([
            (callback) => {
                fs.stat(filePath, callback);
            },
            (stats, callback) => {
                // collect necessary file info.
                const size = stats['size'];
                const stream = fs.createReadStream(filePath, {
                    'flags': 'r',
                    //'encoding': 'binary',
                    'mode': 0o666,
                    'bufferSize': 64 * 1024
                });
                const name = path.basename(filePath);
                callback(null, {
                    name,
                    size,
                    stream
                });
            },
            (fileDescriptor, callback) => {
                // Send file info.
                const fileInfo = {
                    name: fileDescriptor.name,
                    size: fileDescriptor.size
                };
                const fileInfoString = JSON.stringify(fileInfo);
                this.socket.send(fileInfoString, (error) => {
                    callback(error, fileDescriptor);
                });
            },
            (fileDescriptor, callback) => {
                const stream = fileDescriptor.stream;
                stream.on('end', () => {
                    callback(null);
                });
                stream.on('data', (data) => {
                    this.socket.send(data, {
                        binary: true,
                        mask: false
                    }, (error) => {
                        if (error) {
                            stream.close();
                            callback(error);
                        }
                    });
                });
            }
        ], callback);


    }

    connect(host, port) {
        const address = 'ws://' + host + ':' + port;
        this.socket = new WebSocketClient(address);
        this.socket.on('message', (message) => {
            console.log('Server message');
        });

        this.socket.on('close', () => {
            console.log('Server socket closed');
        });

        this.socket.on('error', (error) => {
            console.log('Server socket error: ' + error);
        });
    }
}

module.exports = WSClient;
