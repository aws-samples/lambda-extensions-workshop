const {DynamoDBClient, QueryCommand} = require("@aws-sdk/client-dynamodb"); // CommonJS import
const ddbUtil = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient();

exports.handler = async (event) => {
    try {
        // it should be metric or log
        const type = event.resource.split('/').pop();

        // Prepare the item to be stored in DynamoDB
        // get the items from dynamodb where the sortkey starts with the apipath
        const input = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: '#pkName = :pkValue',
            ExpressionAttributeNames: {
                '#pkName': 'type'
            },
            ExpressionAttributeValues: {
                ':pkValue': {S: type}
            },
            ScanIndexForward: false // Sort descending
        };

        const command = new QueryCommand(input);
        const response = await client.send(command);

        const items = response.Items.map((item) => {
            let data = ddbUtil.unmarshall(item);
            const function_timestamp = data.function_timestamp.split('#');
            data.function = function_timestamp[0];
            data.timestamp = function_timestamp[1];
            delete data.function_timestamp;

            return data;
        });

        return { body: JSON.stringify(items) };
    } catch (error) {
        console.log(error);
        throw error;
    }
};