# AWS CDK Example: A REST API backed by Lambda Functions

This example AWS CDK application deploys a Lambda function and an API Gateway resource. The example illustrates:

- bundling Lambda functions with dependencies

## About

This is a REST API endpoint backed by a Lambda function. The Lambda function depends on external libraries. The CDK resources demonstrate how to bundle a more complex Lambda function with all of it's dependencies.

Other examples in this repository will build upon this example with more complexity.

## Available Scripts

### Application Scripts

Run these application scripts from the base project directory.

#### `npm run build`

Builds the Lambda function to prepare for deployment. Run this before using the CDK to deploy to AWS.

### CDK Scripts

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
