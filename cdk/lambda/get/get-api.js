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
                '#pkName': 'pk'
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
            const data = ddbUtil.unmarshall(item);
            const [functionName, timeStamp] = data.sk.split('#');

            let result = {
                functionName: functionName,
                timeStamp: timeStamp
            };

            switch (data.pk) {
                case 'metric':
                    result.memory = data.memory;
                    result.duration = data.duration;
                    result.init = data.init;
                    break;
                case 'log':
                    result.message = data.message;
                    break;
                default:
                    throw new Error('pk not supported');
            }

            return result;
        });

        return response(200, items);
    } catch (error) {
        console.log(error);
        return response(500, error.message);
    }
};

function response(statusCode, message) {
    const body = (statusCode === 200) ? message : {error: message};

    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
}