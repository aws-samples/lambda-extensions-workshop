const cdk = require('aws-cdk-lib/core');
const {Construct} = require('constructs');
const lambda = require("aws-cdk-lib/aws-lambda");

class ClientConstruct extends Construct {
    constructor(scope, id, props) {
        super(scope, id);

        // nodejs testing functions
        const function1NodeJS = new lambda.Function(this, 'function1NodeJS', {
            functionName: 'lew-function1-nodejs',
            code:  lambda.Code.fromAsset('lambda/client-nodejs'),
            runtime: lambda.Runtime.NODEJS_18_X,
            architecture:  lambda.Architecture.ARM_64,
            handler: 'function.handler',
            timeout: cdk.Duration.seconds(10),
            environment: {
                THROW_ERRORS: 'false'
            }
        });

        const function2NodeJS = new lambda.Function(this, 'function2NodeJS', {
            functionName: 'lew-function2-nodejs',
            code:  lambda.Code.fromAsset('lambda/client-nodejs'),
            runtime: lambda.Runtime.NODEJS_18_X,
            architecture:  lambda.Architecture.ARM_64,
            handler: 'function.handler',
            timeout: cdk.Duration.seconds(10),
            environment: {
                THROW_ERRORS: 'false'
            }
        });

        const function3NodeJS = new lambda.Function(this, 'function3NodeJS', {
            functionName: 'lew-function3-nodejs',
            code:  lambda.Code.fromAsset('lambda/client-nodejs'),
            runtime: lambda.Runtime.NODEJS_18_X,
            architecture:  lambda.Architecture.ARM_64,
            handler: 'function.handler',
            timeout: cdk.Duration.seconds(10),
            environment: {
                THROW_ERRORS: 'true'
            }
        });

        // python testing functions
        const function1Python = new lambda.Function(this, 'function1Python', {
            functionName: 'lew-function1-python',
            code:  lambda.Code.fromAsset('lambda/client-python'),
            runtime: lambda.Runtime.PYTHON_3_11,
            architecture:  lambda.Architecture.ARM_64,
            handler: 'function.handler',
            timeout: cdk.Duration.seconds(10),
            environment: {
                THROW_ERRORS: 'false'
            }
        });

        const function2Python = new lambda.Function(this, 'function2Python', {
            functionName: 'lew-function2-python',
            code:  lambda.Code.fromAsset('lambda/client-python'),
            runtime: lambda.Runtime.PYTHON_3_11,
            architecture:  lambda.Architecture.ARM_64,
            handler: 'function.handler',
            timeout: cdk.Duration.seconds(10),
            environment: {
                THROW_ERRORS: 'false'
            }
        });

        const function3Python = new lambda.Function(this, 'function3Python', {
            functionName: 'lew-function3-python',
            code:  lambda.Code.fromAsset('lambda/client-python'),
            runtime: lambda.Runtime.PYTHON_3_11,
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