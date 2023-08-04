#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const {PartnerStack} = require('../lib/partner-stack');
const {ClientStack} = require("../lib/client-stack");

const env = {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION};
const stackProps = {
    env: env,
    credentials: {
        accessKeyId: 'ABCDEFGHIJKLMNOPQRST',
        accessKeySecret: '1234567890123456789012345678901234567890'
    }
}

const app = new cdk.App();
new PartnerStack(app, 'lew-partner-stack', stackProps);
new ClientStack(app, 'lew-client-stack', stackProps);
