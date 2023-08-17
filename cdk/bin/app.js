#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const {PartnerStack} = require('../lib/partner-stack');
const {ClientStack} = require("../lib/client-stack");
const {FrontEndStack} = require("../lib/frontend-stack");

const app = new cdk.App();

const clientId = app.node.tryGetContext('clientId');
const clientSecret = app.node.tryGetContext('clientSecret');

// if(!clientId || !clientSecret) {
//     throw new Error('Please provide clientId and clientSecret using `-c key=value`');
// }

const props = {
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
    credentials: {
        clientId: clientId,
        clientSecret: clientSecret
    }
}

new PartnerStack(app, 'lew-partner-stack', props);
new ClientStack(app, 'lew-client-stack', props);
new FrontEndStack(app, 'lew-frontend-stack',props);
