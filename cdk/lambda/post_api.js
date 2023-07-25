const { DynamoDB } = require('aws-sdk');
exports.handler = async (event) => {
    try {
        // Parse the incoming request body
        const requestBody = JSON.parse(event.body);
        // Create an instance of the DynamoDB DocumentClient
        const dynamoDB = new DynamoDB.DocumentClient();
        // Prepare the item to be stored in DynamoDB
        const item = {
            function: requestBody.function,
            'type_timestamp': `${requestBody.type}#${requestBody.timestamp}`,
            memory: requestBody.memory,
            duration: requestBody.duration,
            init: requestBody.init,
            message: requestBody.message
        };
        // Set up the DynamoDB put operation parameters
        const params = {
            TableName: process.env.TABLE_NAME,
            Item: item
        };
        // Store the item in DynamoDB
        await dynamoDB.put(params).promise();
        // Return a success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Data stored successfully' })
        };
    } catch (error) {
        // Return an error response if anything goes wrong
       /* return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred', error })
        };*/throw error;
    }
};