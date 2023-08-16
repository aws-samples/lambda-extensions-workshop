const fetch = require('node-fetch');

const baseUrl = "???"
const TIMEOUT_MS = 0; // Maximum time (in milliseconds) that a batch is buffered.
const MAX_BYTES = 0; // Maximum size in bytes that the logs are buffered in memory.
const MAX_ITEMS = 0; // Maximum number of events that are buffered in memory.

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
    subscribe,
};