import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class RestDynamodbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Create a new DynamoDB table for storing user data
     */
    const userTable = new dynamodb.TableV2(this, "UserTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    /**
     * Create a new API Gateway REST API
     */
    const api = new apigateway.RestApi(this, "CDKPlaygroundApi", {
      restApiName: "CDK Playground API",
      description: "This is a sample API Gateway for the CDK Playground.",
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
        actions: ["dynamodb:Scan", "dynamodb:PutItem"],
        resources: [userTable.tableArn],
      })
    );

    /**
     * Add a resource to the API Gateway for the "users" path
     */
    const RESOURCE_PATH_USERS = "users";
    const usersResource = api.root.addResource(RESOURCE_PATH_USERS);

    /**
     * Create a new Lambda function for creating users
     */
    const createUserLogGroup = new logs.LogGroup(this, "CreateUserFunctionLogGroup", {
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const createUserFunction = new lambda_nodejs.NodejsFunction(this, "CreateUserFunction", {
      entry: "src/handlers/users-create.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(6),
      logGroup: createUserLogGroup,
      role: functionRole,
      environment: {
        TABLE_NAME_USER: userTable.tableName,
      },
    });

    usersResource.addMethod("POST", new apigateway.LambdaIntegration(createUserFunction));

    /**
     * Create a new Lambda function for listing users
     */
    const listUsersLogGroup = new logs.LogGroup(this, "ListUsersLogGroup", {
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const listUsersFunction = new lambda_nodejs.NodejsFunction(this, "ListUsersFunction", {
      entry: "src/handlers/users-list.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(6),
      logGroup: listUsersLogGroup,
      role: functionRole,
      environment: {
        TABLE_NAME_USER: userTable.tableName,
      },
    });

    usersResource.addMethod("GET", new apigateway.LambdaIntegration(listUsersFunction));

    /**
     * Stack outputs
     */
    new cdk.CfnOutput(this, "UserTableName", {
      value: userTable.tableName,
      description: "The name of the DynamoDB table for users",
    });

    new cdk.CfnOutput(this, "UsersApiUrl", {
      value: `${api.url}${RESOURCE_PATH_USERS}`,
      description: "URL for the List Users API endpoint",
    });
  }
}
