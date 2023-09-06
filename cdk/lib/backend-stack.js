const {Stack} = require('aws-cdk-lib');
const {BackendConstruct} = require('./backend-construct');

class BackendStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const backendConstruct = new BackendConstruct(this, 'BackendEnvironmentConstruct', props);
    }
}

module.exports = {BackendStack: BackendStack}