const {Construct} = require('constructs');
const {Table, AttributeType, BillingMode} = require('aws-cdk-lib/aws-dynamodb');
const {RestApi, LambdaIntegration, Model, RequestAuthorizer, IdentitySource, AuthorizationType, Authorizer} = require('aws-cdk-lib/aws-apigateway');
const lambda = require('aws-cdk-lib/aws-lambda');

class PartnerConstruct extends Construct {
    constructor(scope, id, props) {
        super(scope, id);
        // Create DynamoDB table
        const table = new Table(this, 'DDBTable', {
            tableName: 'Observability',
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: {name: 'type', type: AttributeType.STRING},
            sortKey: {name: 'function_timestamp', type: AttributeType.STRING},
        });

        // Lambda function for postAPI
        const postAPI = new lambda.Function(this, 'postAPI', {
            functionName: 'lew-post-api',
            architecture:  lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_18_X,
            code:  lambda.Code.fromAsset('lambda/post'),
            handler: 'post-api.handler',
            environment: {
                TABLE_NAME: table.tableName
            }
        });

        // Lambda function for getAPI
        const getAPI = new lambda.Function(this, 'getAPI', {
            functionName: 'lew-get-api',
            architecture:  lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_18_X,
            code:  lambda.Code.fromAsset('lambda/get'),
            handler: 'get-api.handler',
            environment: {
                TABLE_NAME: table.tableName
            }
        });

        // Lambda function for the backend logic
        const AuthFunction = new lambda.Function(this, 'AuthFunction', {
            code: lambda.Code.fromAsset('lambda/authorizer'),
            functionName: 'auth-handler',
            handler: 'auth-handler.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                TABLE_NAME: table.tableName
            }
        });

        // Create the Lambda Authorizer for API Gateway using the authorization Lambda function
        const authorizer = new RequestAuthorizer(this, 'Authorizer', {
            // restApi: api.restApiId,
            name: 'Authorizer',
            handler: AuthFunction,
            identitySources: [IdentitySource.header('Authorization')],
        });

        // Grant the Lambda function read/write permissions to the DynamoDB table
        table.grantReadWriteData(postAPI);
        table.grantReadData(getAPI);
        table.grantReadData(AuthFunction);
        // Create API Gateway REST API
        const api = new RestApi(this, 'ObservabilityAPI', {
            restApiName: 'ObservabilityAPI'
        });

        const methodResponses = [{
            statusCode: '200',
            responseModels: {
                'application/json': Model.EMPTY_MODEL
            }
        }];


        // Create a resource and add a method to it
        const metric = api.root.addResource('metric');
        metric.addMethod('POST', new LambdaIntegration(postAPI), {
            //apiKeyRequired: true
            methodResponses: methodResponses,
            authorizer: authorizer
        });

        metric.addMethod('GET', new LambdaIntegration(getAPI), {
            apiKeyRequired: false,
            methodResponses: methodResponses
        });

        const log = api.root.addResource('log');
        log.addMethod('POST', new LambdaIntegration(postAPI), {
            //apiKeyRequired: true
            methodResponses: methodResponses,
            authorizer: authorizer
        });

        log.addMethod('GET', new LambdaIntegration(getAPI), {
            apiKeyRequired: false,
            methodResponses: methodResponses
        });

    }
}

module.exports = {PartnerConstruct: PartnerConstruct}