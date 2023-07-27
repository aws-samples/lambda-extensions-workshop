const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const ddbUtil = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient();

exports.handler = async (event) => {
    try {
        const type = event.resource.split('/').pop();

        // Parse the incoming request body
        const body = JSON.parse(event.body);

        // check for required fields
        if(!body) {
            return response(400, 'invalid payload');
        }
        if(!body.functionName) {
            return response(400, 'functionName is missing');
        }
        if(!body.timestamp) {
            return response(400, 'timeStamp is missing');
        }

        // Prepare the item to be stored in DynamoDB
        const item = {
            type:  type,
            function_timestamp: `${body.functionName}#${body.timestamp}`,
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
        await client.send(command);

        // Return a success response
        return response(200, 'Data stored successfully');

    } catch (error) {
        console.log(error);
        return response(500, error.message);
    }
};

function response(statusCode, message) {
    const key = (statusCode === 200) ? 'message':'error';

    return {
        statusCode: statusCode,
        body: JSON.stringify({[key]:message})
    }
}