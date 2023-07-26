const {Stack} = require('aws-cdk-lib');
const {ClientConstruct} = require('./client-construct');

class ClientStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new ClientConstruct(this, 'ClientConstruct');
    }
}

module.exports = {ClientStack: ClientStack}