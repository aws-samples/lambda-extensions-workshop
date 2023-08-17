const {Construct} = require('constructs');
const cdk = require('aws-cdk-lib');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const ddbUtil = require("@aws-sdk/util-dynamodb");
const apigateway = require('aws-cdk-lib/aws-apigateway');
const lambda = require('aws-cdk-lib/aws-lambda');
const cr = require('aws-cdk-lib/custom-resources');

class PartnerConstruct extends Construct {

    constructor(scope, id, props) {
        super(scope, id);
        // Create DynamoDB table
        const table = new dynamodb.Table(this, 'DDBTable', {
            tableName: 'Observability',
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: {name: 'pk', type: dynamodb.AttributeType.STRING},
            sortKey: {name: 'sk', type: dynamodb.AttributeType.STRING},
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

        const credentials = props.credentials;
        new cr.AwsCustomResource(this, 'initCredentials', {
            onCreate: {
                service: 'DynamoDB',
                action: 'putItem',
                parameters: {
                    TableName: table.tableName,
                    Item: ddbUtil.marshall({
                        pk: 'auth',
                        sk: credentials.clientId,
                        clientSecret: credentials.clientSecret
                    }, {removeUndefinedValues: true})
                },
                physicalResourceId: 'initialDataDDB'
            },
            policy: cr.AwsCustomResourcePolicy.fromSdkCalls({resources: [table.tableArn]})
        });

        // Lambda function for postAPI
        const postAPI = new lambda.Function(this, 'postAPI', {
            functionName: 'lew-post-api',
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset('lambda/post'),
            handler: 'post-api.handler',
            environment: {
                TABLE_NAME: table.tableName,
                AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1"
            }
        });


        // Lambda function for getAPI
        const getAPI = new lambda.Function(this, 'getAPI', {
            functionName: 'lew-get-api',
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset('lambda/get'),
            handler: 'get-api.handler',
            environment: {
                TABLE_NAME: table.tableName
            }
        });

        // Lambda function for the backend logic
        const AuthFunction = new lambda.Function(this, 'authFunction', {
            code: lambda.Code.fromAsset('lambda/authorizer'),
            functionName: 'auth-handler',
            handler: 'auth-handler.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                TABLE_NAME: table.tableName
            }
        });

        // Create the Lambda Authorizer for API Gateway using the authorization Lambda function
        // const authorizer = new apigateway.RequestAuthorizer(this, 'authorizer', {
        //     name: 'Authorizer',
        //     handler: AuthFunction,
        //     identitySources: [apigateway.IdentitySource.header('Authorization')],
        // });

        // Grant the Lambda function read/write permissions to the DynamoDB table
        table.grantReadWriteData(postAPI);
        table.grantReadData(getAPI);
        table.grantReadData(AuthFunction);

        // Create API Gateway REST API
        const api = new apigateway.RestApi(this, 'ObservabilityAPI', {
            restApiName: 'ObservabilityAPI'
        });

        const methodResponses = [{
            statusCode: '200',
            responseModels: {
                'application/json': apigateway.Model.EMPTY_MODEL
            }
        }];


        // Create a resource and add a method to it
        const metric = api.root.addResource('metric');
        metric.addMethod('POST', new apigateway.LambdaIntegration(postAPI), {
            //apiKeyRequired: true
            methodResponses: methodResponses,
            //authorizer: authorizer
        });

        metric.addMethod('GET', new apigateway.LambdaIntegration(getAPI), {
            apiKeyRequired: false,
            methodResponses: methodResponses
        });

        const log = api.root.addResource('log');
        log.addMethod('POST', new apigateway.LambdaIntegration(postAPI), {
            //apiKeyRequired: true
            methodResponses: methodResponses,
            //authorizer: authorizer
        });

        log.addMethod('GET', new apigateway.LambdaIntegration(getAPI), {
            apiKeyRequired: false,
            methodResponses: methodResponses
        });
    }
}

module.exports = {PartnerConstruct: PartnerConstruct}