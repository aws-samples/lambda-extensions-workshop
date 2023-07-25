const {Stack} = require('aws-cdk-lib');
const {PartnerEnvironmentConstruct} = require('./partner_environment_construct');

class PartnerEnvironmentStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    new PartnerEnvironmentConstruct(this, 'PartnerEnvironmentConstruct');
  }
}

module.exports = { PartnerEnvironmentStack }