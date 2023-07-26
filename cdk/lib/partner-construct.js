const {Construct} = require('constructs');
const {Table, AttributeType, BillingMode} = require('aws-cdk-lib/aws-dynamodb');
const {RestApi, LambdaIntegration, Model} = require('aws-cdk-lib/aws-apigateway');
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

        // Create Lambda function
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

        // Grant the Lambda function read/write permissions to the DynamoDB table
        table.grantReadWriteData(postAPI);
        table.grantReadData(getAPI);
        // Create API Gateway REST API
        const api = new RestApi(this, 'ObservabilityAPI', {
            restApiName: 'ObservabilityAPI',
            deployOptions: {
                stageName: 'prod',
                loggingLevel: 'INFO',
                dataTraceEnabled: true,
                metricsEnabled: true,
                tracingEnabled: true,
                cacheClusterEnabled: false
            }
        });

        const methodResponses = [{
            statusCode: '200',
            responseModels: {
                'application/json': Model.EMPTY_MODEL
            }
        }];


        // Create a resource and associate the integration with a POST method
        const resource = api.root.addResource('metric');
        resource.addMethod('POST', new LambdaIntegration(postAPI), {
            //apiKeyRequired: true
            methodResponses: methodResponses
        });

        resource.addMethod('GET', new LambdaIntegration(getAPI), {
            apiKeyRequired: false,
            methodResponses: methodResponses
        });

    }
}

module.exports = {PartnerConstruct: PartnerConstruct}