#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { CdkPlaygroundUserServiceStack } from "./stacks/user-service-stack";
import { CDK_AWS_REGION, CDK_DEFAULT_ACCOUNT, CDK_ENV } from "./utils/config";

const app = new cdk.App();
const stack = new CdkPlaygroundUserServiceStack(app, "CdkPlaygroundApiStack", {
  env: { account: CDK_DEFAULT_ACCOUNT, region: CDK_AWS_REGION },
});

cdk.Tags.of(stack).add("App", "cdk-playground.leanstacks.net");
cdk.Tags.of(stack).add("Env", CDK_ENV);
cdk.Tags.of(stack).add("OU", "leanstacks");
cdk.Tags.of(stack).add("Owner", "Matthew Warman");
