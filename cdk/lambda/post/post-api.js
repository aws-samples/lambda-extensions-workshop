const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const ddbUtil = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient();

exports.handler = async (event) => {
    try {
        const type = event.resource.split('/').pop();

        // Parse the incoming request body
        const body = JSON.parse(event.body);

        if(!body || !Array.isArray(body)) {
            return response(400, 'invalid payload');
        }

        for(const bodyItem of body) {
            if(!bodyItem.functionName) {
                return response(400, 'functionName is missing');
            }

            if(!bodyItem.timestamp) {
                return response(400, 'timeStamp is missing');
            }

            // Prepare the item to be stored in DynamoDB
            const item = {
                pk:  type,
                sk: `${bodyItem.functionName}#${bodyItem.timestamp}`,
                clientSecret: bodyItem.clientSecret,
                memory: bodyItem.memory,
                duration: bodyItem.duration,
                init: bodyItem.init,
                message: bodyItem.message
            };

            // Set up the DynamoDB put operation parameters
            const input = {
                TableName: process.env.TABLE_NAME,
                Item: ddbUtil.marshall(item, {removeUndefinedValues: true})
            };
            const command = new PutItemCommand(input);
            await client.send(command);
        }
        
        return response(200, {message:'Data stored successfully'});
    } catch (error) {
        console.log(error);
        return response(500, error.message);
    }
};

function response(statusCode, message) {
    const body = (statusCode === 200) ? message : {error:message};

    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            'Access-Control-Allow-Origin':'*'
        }
    }
}

