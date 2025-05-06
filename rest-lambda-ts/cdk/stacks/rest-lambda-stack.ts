import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class RestLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Create a new API Gateway REST API
     */
    const api = new apigateway.RestApi(this, "CdkPlaygroundApi", {
      restApiName: "CDK Playground API",
      description: "CDK Playground REST API",
    });

    /**
     * Create a new Lambda function execution role
     */
    const functionRole = new iam.Role(this, "CdkPlaygroundFunctionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")],
    });
    functionRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["s3:ListAllMyBuckets"],
        resources: ["*"],
      })
    );

    /**
     * Create a new Lambda function for greeting, i.e. "Hello world!"
     */
    const RESOURCE_PATH_GREETINGS = "greetings";
    const greetingsResource = api.root.addResource(RESOURCE_PATH_GREETINGS);

    const getGreetingFunctionLogGroup = new logs.LogGroup(this, "GetGreetingLogGroup", {
      logGroupName: "/aws/lambda/GetGreetingFunction",
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const getGreetingFunction = new lambda_nodejs.NodejsFunction(this, "GetGreetingFunction", {
      entry: "src/handlers/greeting-get.ts", // Path to the Lambda function code
      handler: "handler", // Name of the exported function
      runtime: lambda.Runtime.NODEJS_22_X, // Lambda runtime
      memorySize: 128, // Memory size in MB
      timeout: cdk.Duration.seconds(6), // Timeout duration
      logGroup: getGreetingFunctionLogGroup, // Log group for the Lambda function
      role: functionRole, // IAM role for the Lambda function
      environment: {
        // Environment variables for the Lambda function
        GREETING_TEXT: "Hola mundo!", // Example environment variable
      },
    });

    greetingsResource.addMethod("GET", new apigateway.LambdaIntegration(getGreetingFunction));

    /**
     * Create a new Lambda function for listing S3 buckets
     */
    const RESOURCE_PATH_BUCKETS = "buckets";
    const bucketsResource = api.root.addResource(RESOURCE_PATH_BUCKETS);

    const listBucketsFunctionLogGroup = new logs.LogGroup(this, "ListBucketsLogGroup", {
      logGroupName: "/aws/lambda/ListBucketsFunction",
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const listBucketsFunction = new lambda_nodejs.NodejsFunction(this, "ListBucketsFunction", {
      entry: "src/handlers/bucket-list.ts", // Path to the Lambda function code
      handler: "handler", // Name of the exported function
      runtime: lambda.Runtime.NODEJS_22_X, // Lambda runtime
      memorySize: 128, // Memory size in MB
      timeout: cdk.Duration.seconds(6), // Timeout duration
      logGroup: listBucketsFunctionLogGroup, // Log group for the Lambda function
      role: functionRole, // IAM role for the Lambda function
    });

    bucketsResource.addMethod("GET", new apigateway.LambdaIntegration(listBucketsFunction));

    /**
     * Stack outputs
     */
    new cdk.CfnOutput(this, "GetGreetingApiUrl", {
      value: `${api.url}${RESOURCE_PATH_GREETINGS}`,
      description: "URL of the GET greeting API",
    });

    new cdk.CfnOutput(this, "ListBucketsApiUrl", {
      value: `${api.url}${RESOURCE_PATH_BUCKETS}`,
      description: "URL of the GET buckets API",
    });
  }
}
