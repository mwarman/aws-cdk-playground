# AWS CDK Playground

A playground full of examples for learning and experimentation with the [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html).

## About

This project contains a variety of example projects which use the AWS Cloud Development Kit (CDK) to deploy the component to AWS.

Many of the examples have a natural sequence, adding complexity to an earlier example. Those examples are denoted in the lists below.

## Examples

### Getting Started

- [Hello CDK](./hello-cdk/README.md) - An introduction to the AWS CDK from the official documentation

### CloudFront

- [CloudFront SPA](./cloudfront-spa/README.md) - Host a single-page application, React, in AWS CloudFront

### API Gateway

- [REST Hello](./rest-hello/README.md) - An API Gateway with a hello world Lambda endpoint
- [REST Lambda TypeScript](./rest-lambda-ts/README.md) - An API Gateway REST API backed by a more complex Lambda function with external dependencies requiring a different approach to package and deploy
- [REST DynamoDB](./rest-dynamodb/README.md) - An API Gateway REST API with CRUD endpoints in Lambda which act as a data access layer for a DynamoDB table
