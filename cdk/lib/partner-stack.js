const {Stack} = require('aws-cdk-lib');
const {PartnerConstruct} = require('./partner-construct');

class PartnerStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new PartnerConstruct(this, 'PartnerEnvironmentConstruct');
    }
}

module.exports = {PartnerStack: PartnerStack}