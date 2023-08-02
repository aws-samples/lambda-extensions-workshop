const {DynamoDBClient, QueryCommand} = require("@aws-sdk/client-dynamodb"); // CommonJS import
const ddbUtil = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient();

// max amount of items return by the api
const ITEMS_LIMIT = 20;

exports.handler = async (event) => {
    try {
        // it should be metric or log
        const type = event.resource.split('/').pop();

        // get the items from dynamodb where the sortkey starts with the apipath
        const input = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: '#pkName = :pkValue',
            Limit: ITEMS_LIMIT,
            ExpressionAttributeNames: {
                '#pkName': 'type'
            },
            ExpressionAttributeValues: {
                ':pkValue': {S: type}
            },
            ScanIndexForward: false // Sort descending
        };

        const command = new QueryCommand(input);
        const query = await client.send(command);

        // parse items from ddb format to the api format
        const items = query.Items.map((item) => {
            let data = ddbUtil.unmarshall(item);
            const function_timestamp = data.function_timestamp.split('#');
            data.functionName = function_timestamp[0];
            data.timestamp = function_timestamp[1];
            delete data.function_timestamp;
            delete data.type;

            return data;
        });

        return response(200, items);
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