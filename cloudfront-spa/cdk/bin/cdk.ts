#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { CloudFrontSpaStack } from "../lib/cdk-stack";
import { CDK_ENV } from "../lib/config";

const app = new cdk.App();
const stack = new CloudFrontSpaStack(app, "CloudFrontSpaStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

cdk.Tags.of(stack).add("App", "cdk-playground.leanstacks.net");
cdk.Tags.of(stack).add("Env", CDK_ENV);
cdk.Tags.of(stack).add("OU", "leanstacks");
cdk.Tags.of(stack).add("Owner", "Matthew Warman");
