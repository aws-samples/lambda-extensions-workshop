const fetch = require('node-fetch');

const AWS_LAMBDA_FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME;

const DISPATCH_POST_URI = process.env.DISPATCH_POST_URI;
const ENDPOINT_USER = process.env.ENDPOINT_USER;
const ENDPOINT_PASSWORD = process.env.ENDPOINT_PASSWORD;

function dispatchTelemetry(queue, force) {
    while (queue.length !== 0) {
        console.log('[telementry_dispatcher] Dispatch telemetry data');
        const filteredQueueMetrics = [];
        const filteredQueueLogs = [];
        const batch = queue.shift();

        for (const event of batch) {
            if (event.type === 'function') {
                filteredQueueLogs.push(event);
            } else if (event.type === 'platform.report') {
                filteredQueueMetrics.push(event);
            }
        }

        const logData = formatLogData(filteredQueueLogs);
        const metricData = formatMetricData(filteredQueueMetrics);
        postData(logData, 'log');
        postData(metricData, 'metric');
    }
}

module.exports = {
    dispatchTelemetry
};