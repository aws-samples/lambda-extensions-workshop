const {Construct} = require('constructs');
const codecommit = require('aws-cdk-lib/aws-codecommit');
const amplify = require('aws-cdk-lib/aws-amplify');
const iam = require('aws-cdk-lib/aws-iam');
const cr = require('aws-cdk-lib/custom-resources');
const fs = require('fs');
const yaml = require('js-yaml');
const cdk = require('aws-cdk-lib');
const { CfnOutput } = require('aws-cdk-lib');


class FrontendConstruct extends Construct {
    constructor(scope, id, props) {
        super(scope, id);

        const repo = new codecommit.Repository(this, 'Repository', {
            repositoryName: 'lewRepository',
            description: 'Some description.', // optional property
            code: codecommit.Code.fromDirectory('partner-frontend'), // required property
        });

        const amplifyRole = new iam.Role(this, 'AmplifyRole', {
            assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
            inlinePolicies: {
                'CodeCommit': new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            actions: ['codecommit:GitPull'],
                            effect: iam.Effect.ALLOW,
                            resources: ['*'],
                        })
                    ]
                })
            }
        });

        const api_url = cdk.Fn.importValue('APIEndpointURL')

        const cfnApp = new amplify.CfnApp(this, 'AmplifyApp', {
            name: 'lewApp',
            repository: repo.repositoryCloneUrlHttp,
            platform: 'WEB',
            iamServiceRole: amplifyRole.roleArn,
            buildSpec: readYamlAsString('./buildspec.yml'),
            environmentVariables: [{
                name: 'API_URL',
                value: api_url,
              }],
        });

        const cfnBranch = new amplify.CfnBranch(this, 'AmplifyBranch', {
            appId: cfnApp.attrAppId,
            branchName: 'main',
            stage: 'PRODUCTION',
            enableAutoBuild: true
        })

        const customResourceRole = new iam.Role(this, 'CustomResourceRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
          
          customResourceRole.addToPolicy(new iam.PolicyStatement({
            actions: ['amplify:*'],
            resources: ['*'], // Adjust the ARN accordingly
        }));

        new cr.AwsCustomResource(this, 'amplifyJob', {
            onCreate: {
                service: 'Amplify',
                action: 'startJob',
                parameters: { 
                    appId: cfnApp.attrAppId,
                    branchName: 'main',
                    jobType: 'RELEASE'
                },
                physicalResourceId: 'amplify-deployment-cust-res', // Replace with a unique ID
            },
            role: customResourceRole
        });

        //output frontend app url for participant to use
        new CfnOutput(this, 'ObservabilityToolURL', {
            value: 'https://main.' + cfnApp.attrDefaultDomain, 
            exportName: 'ObservabilityToolURL',
            });
    }
}

function readYamlAsString(filePath) {
    try {
      const yamlContent = fs.readFileSync(filePath, 'utf-8');
      return yamlContent;
    } catch (error) {
      console.error('Error reading YAML file:', error);
      return null;
    }
  }

module.exports = {FrontendConstruct: FrontendConstruct}
