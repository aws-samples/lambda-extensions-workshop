const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const ddbUtil = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient();

exports.handler = async (event) => {
    try {
        // Parse the incoming request body
        const requestBody = JSON.parse(event.body);

        // Prepare the item to be stored in DynamoDB
        const item = {
            type:  requestBody.type,
            function_timestamp: `${requestBody.function}#${requestBody.timestamp}`,
            memory: requestBody.memory,
            duration: requestBody.duration,
            init: requestBody.init,
            message: requestBody.message
        };

        // Set up the DynamoDB put operation parameters
        const input = {
            TableName: process.env.TABLE_NAME,
            Item: ddbUtil.marshall(item, {removeUndefinedValues: true})
        };
        const command = new PutItemCommand(input);
        const response = await client.send(command);

        // Return a success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Data stored successfully' })
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};