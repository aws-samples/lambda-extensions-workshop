const { DynamoDBClient, GetItemCommand, QueryCommand} = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = new DynamoDBClient();

exports.handler =  async (event) => {

    const headers = event.headers.Authorization
    const decodedPayload = Buffer.from(headers, 'base64').toString('utf-8');
    const [ clientId, clientSecret ] = decodedPayload.split(":");

    console.log("clientId"+clientId+"_");
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            type: {S: 'auth'},
            function_timestamp: {S: clientId}
        }
    };

    const getItemCommand = new GetItemCommand(params);

    try {
        const result = await dynamoDBClient.send(getItemCommand);

        if (result.Item && result.Item.clientSecret.S === clientSecret) {
            return generatePolicy('user', 'Allow', event.methodArn);
        } else {
            return generatePolicy('user', 'Deny', event.methodArn);
        }
    } catch (error) {
        console.error("Error:", error);
        return generatePolicy('user', 'Deny', event.methodArn);
    }
};

// Help function to generate an IAM policy
function generatePolicy (principalId, effect, resource) {
    let authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        let policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        let statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    return authResponse;
}
