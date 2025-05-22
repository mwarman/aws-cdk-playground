import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class CdkPlaygroundAuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, "CdkPlaygroundUserPool", {
      userPoolName: "CdkPlaygroundUserPool",
      featurePlan: cognito.FeaturePlan.LITE,
      signInAliases: {
        email: true,
      },
      signInCaseSensitive: false,
    });
  }
}
