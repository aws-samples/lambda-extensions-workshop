const {Stack} = require('aws-cdk-lib');
const {BackendConstruct} = require('./partner-construct');

class BackendStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new BackendConstruct(this, 'PartnerEnvironmentConstruct', props);
    }
}

module.exports = {BackendStack: BackendStack}