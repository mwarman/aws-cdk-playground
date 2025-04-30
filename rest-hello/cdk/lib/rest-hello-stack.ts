import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

import { Construct } from "constructs";

export class RestHelloStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Lambda function that handles the hello world request.
     */
    const helloWorldLambda = new lambda.Function(this, "HelloWorldFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset("../src/handlers/hello-world"),
      handler: "index.handler",
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
    const helloResource = api.root.addResource("hello");

    /**
     * Add a GET method to the "hello" resource.
     * This will allow us to trigger the hello world Lambda function with a GET request.
     */
    helloResource.addMethod("GET");
  }
}
