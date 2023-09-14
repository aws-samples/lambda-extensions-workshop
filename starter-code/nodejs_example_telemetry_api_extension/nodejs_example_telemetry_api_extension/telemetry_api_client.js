const fetch = require('node-fetch');

const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2022-07-01/telemetry`;
const TIMEOUT_MS = 1000; // Maximum time (in milliseconds) that a batch is buffered.
const MAX_BYTES = 256 * 1024; // Maximum size in bytes that the logs are buffered in memory.
const MAX_ITEMS = 10000; // Maximum number of events that are buffered in memory.

async function subscribe(extensionId, listenerUri) {
    console.log('[telemetry-api:subscribe] Subscribing', {baseUrl, extensionId, listenerUri});

    //OUR CODE GOES HERE

    switch (res.status) {
        case 200:
            //OUR CODE GOES HERE
            break;
        case 202:
            //OUR CODE GOES HERE
            break;
        default:
            //OUR CODE GOES HERE
            break;
    }
}

module.exports = {
    subscribe
};