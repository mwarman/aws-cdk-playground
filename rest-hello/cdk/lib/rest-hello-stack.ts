import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

import { Construct } from "constructs";

export class RestHelloStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Log group for the hello world Lambda function.
     */
    const helloWorldLambdaLogGroup = new logs.LogGroup(
      this,
      "HelloWorldLambdaLogGroup",
      {
        logGroupName: "/aws/lambda/HelloWorldFunction",
        retention: logs.RetentionDays.ONE_WEEK,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    /**
     * Lambda function that handles the hello world request.
     */
    const helloWorldLambda = new lambda.Function(this, "HelloWorldFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset("../src/handlers/hello-world"),
      handler: "index.handler",
      logGroup: helloWorldLambdaLogGroup,
    });

    /**
     * API Gateway that exposes the hello world Lambda function.
     */
    const api = new apigateway.LambdaRestApi(this, "HelloWorldApi", {
      handler: helloWorldLambda,
      proxy: false,
    });

    /**
     * Add a "hello" resource to the API Gateway.
     * This will create an endpoint at /hello that triggers the hello world Lambda function.
     */
    const RESOURCE_PATH_HELLO = "hello";
    const helloResource = api.root.addResource(RESOURCE_PATH_HELLO);

    /**
     * Add a GET method to the "hello" resource.
     * This will allow us to trigger the hello world Lambda function with a GET request.
     */
    helloResource.addMethod("GET");

    /**
     * Stack output that shows the URL of the hello world API.
     */
    new cdk.CfnOutput(this, "HelloWorldApiUrl", {
      value: `${api.url}${RESOURCE_PATH_HELLO}`,
      description: "URL of the Hello World API",
    });
  }
}
