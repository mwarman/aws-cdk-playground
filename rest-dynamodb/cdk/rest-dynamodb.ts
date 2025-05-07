#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { CDK_ENV } from "./utils/config";
import { RestDynamodbStack } from "./stacks/rest-dynamodb-stack";

const app = new cdk.App();
const stack = new RestDynamodbStack(app, "RestDynamodbStack", {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

cdk.Tags.of(stack).add("App", "cdk-playground.leanstacks.net");
cdk.Tags.of(stack).add("Env", CDK_ENV);
cdk.Tags.of(stack).add("OU", "leanstacks");
cdk.Tags.of(stack).add("Owner", "Matthew Warman");
