const cdk = require('aws-cdk-lib/core');
const {Construct} = require('constructs');
const lambda = require("aws-cdk-lib/aws-lambda");

class ClientConstruct extends Construct {
    constructor(scope, id, props) {
        super(scope, id);

        const function1 = new lambda.Function(this, 'function1', {
            functionName: 'lew-function1',
            code:  lambda.Code.fromAsset('lambda/client'),
            runtime: lambda.Runtime.NODEJS_18_X,
            architecture:  lambda.Architecture.ARM_64,
            handler: 'function.handler',
            timeout: cdk.Duration.seconds(10),
            environment: {
                THROW_ERRORS: 'false'
            }
        });

        const function2 = new lambda.Function(this, 'function2', {
            functionName: 'lew-function2',
            code:  lambda.Code.fromAsset('lambda/client'),
            runtime: lambda.Runtime.NODEJS_18_X,
            architecture:  lambda.Architecture.ARM_64,
            handler: 'function.handler',
            timeout: cdk.Duration.seconds(10),
            environment: {
                THROW_ERRORS: 'false'
            }
        });

        const function3 = new lambda.Function(this, 'function3', {
            functionName: 'lew-function3',
            code:  lambda.Code.fromAsset('lambda/client'),
            runtime: lambda.Runtime.NODEJS_18_X,
            architecture:  lambda.Architecture.ARM_64,
            handler: 'function.handler',
            timeout: cdk.Duration.seconds(10),
            environment: {
                THROW_ERRORS: 'true'
            }
        });
    }
}

module.exports = {ClientConstruct: ClientConstruct}