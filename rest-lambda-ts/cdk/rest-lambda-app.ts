#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { RestLambdaStack } from "./stacks/rest-lambda-stack";

const app = new cdk.App();
new RestLambdaStack(app, "RestLambdaStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
