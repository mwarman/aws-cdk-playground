import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

import { Construct } from "constructs";

export class RestHelloStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * API Gateway REST API that serves as the entry point for the hello world Lambda function.
     * This API will be used to trigger the Lambda function when a GET request is made to the /hello endpoint.
     * The API Gateway will handle the request and pass it to the Lambda function for processing.
     * The API Gateway will also handle the response from the Lambda function and return it to the client.
     * The API Gateway will be configured to use a Lambda integration, which means that the Lambda function
     * will be invoked directly by the API Gateway.
     */
    const api = new apigateway.RestApi(this, "HelloWorldApi", {
      restApiName: "Hello World API",
      description: "CDK Playground REST Hello API",
    });

    /**
     * Add a "hello" resource to the API Gateway.
     * This will create an endpoint at /hello that triggers the hello world Lambda function.
     */
    const RESOURCE_PATH_HELLO = "hello";
    const helloResource = api.root.addResource(RESOURCE_PATH_HELLO);

    /**
     * Log group for the hello world Lambda function.
     */
    const getHelloLambdaLogGroup = new logs.LogGroup(
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
    const getHelloLambda = new lambda.Function(this, "HelloWorldFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset("../src/handlers/hello-world"),
      handler: "index.handler",
      logGroup: getHelloLambdaLogGroup,
    });

    /**
     * Add a GET method to the "hello" resource.
     * This will allow us to trigger the hello world Lambda function with a GET request.
     */
    helloResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getHelloLambda)
    );

    /**
     * Stack output that shows the URL of the hello world API.
     */
    new cdk.CfnOutput(this, "HelloWorldApiUrl", {
      value: `${api.url}${RESOURCE_PATH_HELLO}`,
      description: "URL of the Hello World API",
    });
  }
}
