#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { CDK_AWS_REGION, CDK_DEFAULT_ACCOUNT, CDK_ENV } from "./utils/config";
import { RestDynamodbStack } from "./stacks/rest-dynamodb-stack";

const app = new cdk.App();
const stack = new RestDynamodbStack(app, "RestDynamodbStack", {
  description: "CDK Playground - Rest DynamoDB Stack",
  env: { account: CDK_DEFAULT_ACCOUNT, region: CDK_AWS_REGION },
});

cdk.Tags.of(stack).add("App", "cdk-playground.leanstacks.net");
cdk.Tags.of(stack).add("Env", CDK_ENV);
cdk.Tags.of(stack).add("OU", "leanstacks");
cdk.Tags.of(stack).add("Owner", "Matthew Warman");
