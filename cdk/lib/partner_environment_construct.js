const {Construct} = require('constructs');
const { Duration } = require('aws-cdk-lib');
const { NodejsFunction } = require('aws-cdk-lib/aws-lambda-nodejs');
const { Table, AttributeType } = require('aws-cdk-lib/aws-dynamodb');
const { RestApi, LambdaIntegration } = require('aws-cdk-lib/aws-apigateway');

class PartnerEnvironmentConstruct extends Construct {
    constructor(scope, id, props) {
        
        super(scope, id, props);
        // Create DynamoDB table
        const table = new Table(this, 'MyTable', {
            tableName: 'LambdaExtensionsWorkshop',
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: 'function', type: AttributeType.STRING },
            sortKey: { name: 'type_timestamp', type: AttributeType.STRING },
        });
        // Create Lambda function
        const postAPI = new NodejsFunction(this, 'postAPI', {
            functionName: 'LambdaExtensionsWorkshopPostApi',
            entry: 'lambda/post_api.js',
            handler: 'handler',
            environment: {
                TABLE_NAME: table.tableName
            }
        });

        const getAPI = new NodejsFunction(this, 'getAPI', {
            functionName: 'LambdaExtensionsWorkshopGetApi',
            entry: 'lambda/get_api.js',
            handler: 'handler',
            environment: {
                TABLE_NAME: table.tableName
            }
        });

        // Grant the Lambda function read/write permissions to the DynamoDB table
        table.grantReadWriteData(postAPI);
        table.grantReadData(getAPI);
        // Create API Gateway REST API
        const api = new RestApi(this, 'MyApi', {
            restApiName: 'My API',
            deployOptions: {
                stageName: 'prod',
                loggingLevel: 'INFO',
                dataTraceEnabled: true,
                metricsEnabled: true,
                tracingEnabled: true,
                loggingLevel: 'INFO',
                stageName: 'prod',
                cacheClusterEnabled: false
            }
        });
        // Create the API Gateway integration with the Lambda function
        const integration = new LambdaIntegration(postAPI);
        // Create a resource and associate the integration with a POST method
        const resource = api.root.addResource('data');
        resource.addMethod('POST', integration, {
            apiKeyRequired: true
        });
    }
    }
module.exports = { PartnerEnvironmentConstruct }