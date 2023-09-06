#!/usr/bin/env node
const cdk = require('aws-cdk-lib');

const {BackendStack} = require('../lib/backend-stack');
const {FrontEndStack} = require("../lib/frontend-stack");
const {ClientStack} = require("../lib/client-stack");

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

const backendStack = new BackendStack(app, 'lew-backend-stack', props);
const frontEndStack = new FrontEndStack(app, 'lew-frontend-stack', props);
const clientStack = new ClientStack(app, 'lew-client-stack', props);

frontEndStack.addDependency(backendStack); // it depends on api endpoint CfnOutput