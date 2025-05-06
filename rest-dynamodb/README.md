# AWS CDK Example: A REST API with Lambda functions and DynamoDB

This example AWS CDK application deploys an API Gateway which routes requests to Lambda functions backed by DynamoDB. The example illustrates:

- a CRUD API
- persistence with DynamoDB

## About

This is a family of REST API endpoints backed by Lambda functions. The functions create, read, update, and delete values from a DynamoDB table.

## Using this example

To use this example, run the following commands at a terminal prompt from the example base directory.

Switch to the required version of Node with [Node Version Manager](https://github.com/nvm-sh/nvm).

```
nvm use
```

Install dependencies.

```
npm install
```

Synthesize the AWS CDK application into a CloudFormation template. This step is optional, but useful if you want to see a YAML version of the template.

```
npm run cdk synth
```

Deploy the application to AWS.

```
npm run cdk deploy
```

The AWS CDK will synthesize the CloudFormation template and deploy the stack(s) to AWS. The outputs will contain the URLs of all API endpoints with which you may interact.

When you are finished, clean up the AWS resources.

```
npm run cdk destroy
```

## Available scripts

### Application scripts

Run these application scripts from the base project directory.

### CDK scripts

Run these AWS CDK scripts from the `/cdk` sub-directory.

#### `npm run cdk synth`

Synthesize a CDK application to produce an AWS CloudFormation template for each stack.

#### `npm run cdk deploy`

Deploy one or more AWS CDK stacks to an AWS environment. Once deployment is complete, you may access the API endpoint with a simple `curl` command such as:

Note: Locate the endpoint URL from the stack deployment outputs and add the `/hello` path.

```
curl https://<api-id>.execute-api.<region>.amazonaws.com/prod/hello
```

#### `npm run cdk destroy`

Delete one or more AWS CDK stacks from the AWS environment.
