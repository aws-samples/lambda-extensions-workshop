const fetch = require('node-fetch');

const AWS_LAMBDA_FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME;
const DISPATCH_POST_URI = process.env.DISPATCH_POST_URI;
const ENDPOINT_USER = process.env.ENDPOINT_USER;
const ENDPOINT_PASSWORD = process.env.ENDPOINT_PASSWORD;

function dispatchTelemetry(queue, force) {
    while (queue.length !== 0) {
        console.log('[telemetry_dispatcher] Dispatch telemetry data');
        const filteredQueueMetrics = [];
        const filteredQueueLogs = [];
        const event = queue.shift();

        if (event.type === 'function') {
            filteredQueueLogs.push(event);
        } else if (event.type === 'platform.report') {
            filteredQueueMetrics.push(event);
        }

        const logData = formatLogData(filteredQueueLogs);
        const metricData = formatMetricData(filteredQueueMetrics);
        postData(logData, 'log');
        postData(metricData, 'metric');
    }
}

function formatLogData(filteredQueue) {
    //OUR CODE GOES HERE
}

function formatMetricData(filteredQueue) {
    //OUR CODE GOES HERE
}

async function postData(data, endpoint) {
    //OUR CODE GOES HERE
}

module.exports = {
    dispatchTelemetry
};