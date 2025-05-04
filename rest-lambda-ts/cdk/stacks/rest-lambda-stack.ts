import * as cdk from "aws-cdk-lib";
import * as logs from "aws-cdk-lib/aws-logs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class RestLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, "CdkPlaygroundApi", {
      restApiName: "CDK Playground API",
      description: "CDK Playground REST API",
    });

    const RESOURCE_PATH_GREETING = "greeting";
    const greetingResource = api.root.addResource(RESOURCE_PATH_GREETING);

    const getGreetingFunctionLogGroup = new logs.LogGroup(
      this,
      "GetGreetingLogGroup",
      {
        logGroupName: "/aws/lambda/GetGreetingFunction",
        retention: logs.RetentionDays.ONE_WEEK,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const getGreetingFunction = new lambda_nodejs.NodejsFunction(
      this,
      "GetGreetingFunction",
      {
        entry: "src/handlers/greeting-get.ts", // Path to the Lambda function code
        handler: "handler", // Name of the exported function
        runtime: lambda.Runtime.NODEJS_22_X, // Lambda runtime
        memorySize: 128, // Memory size in MB
        timeout: cdk.Duration.seconds(6), // Timeout duration
        environment: {
          // Environment variables for the Lambda function
          GREETING_TEXT: "Hola mundo!", // Example environment variable
        },
        logGroup: getGreetingFunctionLogGroup, // Log group for the Lambda function
      }
    );

    greetingResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getGreetingFunction)
    );

    new cdk.CfnOutput(this, "GetGreetingApiUrl", {
      value: `${api.url}${RESOURCE_PATH_GREETING}`,
      description: "URL of the GET greeting API",
    });
  }
}
