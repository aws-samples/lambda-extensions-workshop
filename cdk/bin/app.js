#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const {PartnerStack} = require('../lib/partner-stack');
const {ClientStack} = require("../lib/client-stack");

const env = {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION};

const app = new cdk.App();
new PartnerStack(app, 'lew-partner-stack', {env: env});
new ClientStack(app, 'lew-client-stack', {env: env});
