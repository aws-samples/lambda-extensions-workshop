#!/usr/bin/env node

const extensionsApi = require('./extensions_api_client');
const telemetryApi = require('./telemetry_api_client');
const telemetryListener = require('./telemetry_http_listener');
const telemetryDispatcher = require('./telemetry_dispatcher');

(async function main() {
    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

    console.log('[index:main] Starting the Telemetry API extension');

    //Register the extension with Extensions API
    console.log('[index:main] Registering extension');
    const extensionId = await extensionsApi.register();
    console.log('[index:main] Registered with extensionId', extensionId);

    //Start the local http listener which will receive data from Telemetry API
    console.log('[index:main] Starting the telemetry listener');
    const listenerUri = telemetryListener.start();
    console.log('[index:main] Telemetry listener started at', listenerUri);

    //Subscribe the listener to Telemetry API
    console.log('[index:main] Subscribing the telemetry listener to Telemetry API');
    await telemetryApi.subscribe(extensionId, listenerUri);
    console.log('[index:main] Subscription success');

    while (true) {
        console.log('[index:main] Next');

        //OUR CODE GOES HERE
        
    }

})();

function handleShutdown(event) {
    console.log('[index:handleShutdown]');
    process.exit(0);
}

function handleInvoke(event) {
    console.log('[index:handleInvoke]');
}