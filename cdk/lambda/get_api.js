const { DynamoDB } = require('aws-sdk');
exports.handler = async (event) => {
    try {
        // Parse the incoming request body
        const requestBody = JSON.parse(event.body);
        const apipath = event.path.split("/").pop();
        // Create an instance of the DynamoDB DocumentClient
        const dynamoDB = new DynamoDB.DocumentClient();
        // Prepare the item to be stored in DynamoDB
       // get the items from dynamodb where the sortkey starts with the apipath
        const params = {
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: 'begins_with(sortkey , :sortkey)',
            ExpressionAttributeValues: {
                ':sortkey': apipath
            }}
            dynamoDB.query(params, (error, result) => {
                if (error) {
                    console.log(error);
                    return;
                }
                const response = {
                    statusCode: 200,
                    body: JSON.stringify(result.Items)
                };
                callback(null, response);
            }

    }catch (error) {
        console.log(error);
        throw error;
    }
};