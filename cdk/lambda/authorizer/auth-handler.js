const {DynamoDBClient, GetItemCommand} = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = new DynamoDBClient();

exports.handler = async (event) => {
    try {
        const authorization = event.headers.Authorization
        if(authorization) {
            const credentials = decodeAuthorizationHeader(authorization);
            const retrievedSecret = await retrieveClientSecret(credentials.clientId);

            if (retrievedSecret && retrievedSecret === credentials.clientSecret) {
                return generatePolicy('user', 'Allow', event.methodArn);
            }
        }

        return generatePolicy('user', 'Deny', event.methodArn);
    } catch (error) {
        console.error("Error:", error);
        return generatePolicy('user', 'Deny', event.methodArn);
    }
};

// decode the authorization header
function decodeAuthorizationHeader(authorization) {
    const encodedCredentials = authorization.split('Basic ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    const [clientId, clientSecret] = decodedCredentials.split(":");

    return {clientId, clientSecret};
}

// retrieve the client secret from the database
async function retrieveClientSecret(clientId) {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            pk: {S: 'auth'},
            sk: {S: clientId}
        }
    };
    const getItemCommand = new GetItemCommand(params);
    const result = await dynamoDBClient.send(getItemCommand);

    return (result.Item) ? result.Item.clientSecret.S : undefined;
}

// generate an IAM policy
function generatePolicy(principalId, effect, resource) {
    let authResponse = {
        principalId: principalId
    };

    if (effect && resource) {
        authResponse = {
            policyDocument: {
                Version: '2012-10-17',
                Statement: [{
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }]
            }
        }
    }

    return authResponse;
}
