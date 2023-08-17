const {Stack} = require('aws-cdk-lib');
const {FrontendConstruct} = require('./frontend-construct');

class FrontEndStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new FrontendConstruct(this, 'FrontendConstruct');
    }
}

module.exports = {FrontEndStack: FrontEndStack}