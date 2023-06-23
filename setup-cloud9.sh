## go to tmp directory
cd /tmp

## Ensure AWS CLI v2 is installed
sudo yum -y remove aws-cli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install
rm awscliv2.zip

## Install additional dependencies
sudo yum install -y jq
npm install -g aws-cdk --force

## Resize disk
/home/ec2-user/environment/aws-lambda-java-workshop/resize-cloud9.sh 30

## go back to the main environment directory
cd ~/environment