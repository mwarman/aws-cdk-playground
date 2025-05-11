# AWS CDK Example: A REST API with Lambda functions and DynamoDB

This example AWS CDK application deploys an API Gateway which routes requests to Lambda functions backed by DynamoDB. The example illustrates:

- a CRUD API
- persistence with DynamoDB

## About

This is a family of REST API endpoints backed by Lambda functions. The functions create, read, update, and delete values from a DynamoDB table.

This example provisions the following AWS resources:

- API Gateway REST API
- DynamoDB table
- IAM Role for Lambda execution
- Lambda Functions (5) for:
  - creating, inserting a new item in the table
  - listing, fetching all items from the table
  - finding a single item by the key
  - updating a single item
  - deleting a single item
- CloudWatch Log Groups for each Lambda Function

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

The AWS CDK will synthesize the CloudFormation template and deploy the stack(s) to AWS. The outputs will contain the base URL the API Gateway.

When you are finished, clean up the AWS resources.

```
npm run cdk destroy
```

## Available scripts

Run these application scripts from the base project directory.

#### `npm run build`

Builds the application to the `/dist` directory. This is useful to check for TypeScript errors. The CDK performs a separate build as part of the deploy script, so the `build` script does not need to be run to deploy this component.

#### `npm run cdk synth`

Synthesize a CDK application to produce an AWS CloudFormation template for each stack.

#### `npm run cdk deploy`

Builds and packages the Lambda functions. Deploys one or more AWS CDK stacks to an AWS environment. Once deployment is complete, you may access the API endpoints with a simple `curl` command such as:

Note: Locate the endpoint URL from the stack deployment outputs and add the `/users` path.

```
curl https://<api-id>.execute-api.<region>.amazonaws.com/prod/users
```

#### `npm run cdk destroy`

Deletes the AWS CDK stacks from the AWS environment.
