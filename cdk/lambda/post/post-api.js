const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const ddbUtil = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient();

exports.handler = async (event) => {
    try {
        const type = event.resource.split('/').pop();

        // Parse the incoming request body
        const body = JSON.parse(event.body);

        // Prepare the item to be stored in DynamoDB
        const item = {
            type:  type,
            function_timestamp: `${body.function}#${body.timestamp}`,
            memory: body.memory,
            duration: body.duration,
            init: body.init,
            message: body.message
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