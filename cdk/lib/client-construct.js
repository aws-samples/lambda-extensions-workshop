const cdk = require('aws-cdk-lib/core');
const {Construct} = require('constructs');
const {NodejsFunction} = require('aws-cdk-lib/aws-lambda-nodejs');

class ClientConstruct extends Construct {
    constructor(scope, id, props) {
        super(scope, id);

        const function1 = new NodejsFunction(this, 'function1', {
            functionName: 'lew-function1',
            entry: 'lambda/function.js',
            handler: 'handler',
            timeout: cdk.Duration.seconds(10),
            environment: {
                'THROW_ERRORS': 'false'
            }
        });

        const function2 = new NodejsFunction(this, 'function2', {
            functionName: 'lew-function2',
            entry: 'lambda/function.js',
            handler: 'handler',
            timeout: cdk.Duration.seconds(10),
            environment: {
                'THROW_ERRORS': 'false'
            }
        });

        const function3 = new NodejsFunction(this, 'function3', {
            functionName: 'lew-function3',
            entry: 'lambda/function.js',
            handler: 'handler',
            timeout: cdk.Duration.seconds(10),
            environment: {
                'THROW_ERRORS': 'true'
            }
        });


    }
}

module.exports = {ClientConstruct: ClientConstruct}