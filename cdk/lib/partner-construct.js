const {Construct} = require('constructs');
const {Table, AttributeType, BillingMode} = require('aws-cdk-lib/aws-dynamodb');
const {RestApi, LambdaIntegration, Model} = require('aws-cdk-lib/aws-apigateway');
const cdk = require('aws-cdk-lib');
const ddbUtil = require("@aws-sdk/util-dynamodb");
const lambda = require('aws-cdk-lib/aws-lambda');
const cr = require('aws-cdk-lib/custom-resources');

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
            architecture: lambda.Architecture.ARM_64,
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset('lambda/post'),
            handler: 'post-api.handler',
            environment: {
                TABLE_NAME: table.tableName
            }
        });

        const credentials = props.credentials;
        new cr.AwsCustomResource(this, 'initCredentials', {
            onCreate: {   // will also be called for a CREATE event
                service: 'DynamoDB',
                action: 'putItem',
                parameters: {
                    TableName: table.tableName,
                    Item: ddbUtil.marshall({
                        type: 'auth',
                        function_timestamp: credentials.accessKeyId,
                        secret: credentials.accessKeySecret
                    }),
                    ReturnConsumedCapacity: 'TOTAL'
                },
                physicalResourceId: 'initialDataDDB'
            },
            policy: cr.AwsCustomResourcePolicy.fromSdkCalls({resources: [table.tableArn]})
        });

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


        // Create a resource and add a method to it
        const metric = api.root.addResource('metric');
        metric.addMethod('POST', new LambdaIntegration(postAPI), {
            //apiKeyRequired: true
            methodResponses: methodResponses
        });

        metric.addMethod('GET', new LambdaIntegration(getAPI), {
            apiKeyRequired: false,
            methodResponses: methodResponses
        });

        const log = api.root.addResource('log');
        log.addMethod('POST', new LambdaIntegration(postAPI), {
            //apiKeyRequired: true
            methodResponses: methodResponses
        });

        log.addMethod('GET', new LambdaIntegration(getAPI), {
            apiKeyRequired: false,
            methodResponses: methodResponses
        });
    }
}

module.exports = {PartnerConstruct: PartnerConstruct}