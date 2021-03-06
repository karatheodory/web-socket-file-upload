'use strict';

const async = require('async');
const Optimist = require('optimist');
const WSClient = require('./WSClient');

const argv = Optimist.argv;
if (!argv.path || !argv.host || !argv.port) {
    console.error('Usage: --path path/to/file.here --host host --port port')
    process.exit(1);
}

const wsClient = new WSClient();
async.waterfall([
    (callback) => wsClient.connect(argv.host, argv.port, callback),
    (callback) => wsClient.uploadFile(argv.path, callback)
],(error) => {
    wsClient.disconnect();
    if (error) {
        console.error(JSON.stringify(error));
    } else {
        console.log('Upload successful.');
    }
});
