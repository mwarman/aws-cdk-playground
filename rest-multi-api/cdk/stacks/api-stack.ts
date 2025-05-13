import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambda_nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53_targets from "aws-cdk-lib/aws-route53-targets";
import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";

import { CDK_AWS_HOSTED_ZONE_ID, CDK_AWS_HOSTED_ZONE_NAME, CDK_AWS_CERTIFICATE_ARN } from "../utils/config";

export class CdkPlaygroundApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Import the certificate from AWS Certificate Manager.
     * This certificate is used for the custom domain name of the API Gateway.
     */
    const certificate = certificatemanager.Certificate.fromCertificateArn(
      this,
      "LeanstacksNetCertificate",
      CDK_AWS_CERTIFICATE_ARN
    );

    /**
     * Create a new API Gateway REST API.
     * This API Gateway will be used by Lambda functions in other stacks.
     */
    const api = new apigateway.RestApi(this, "CdkPlaygroundApi", {
      restApiName: "CDK Playground API",
      description: "This is a sample API Gateway for the CDK Playground.",
      domainName: {
        domainName: "cdk-playground-api.dev.leanstacks.net",
        certificate: certificate,
      },
    });

    /**
     * Import the hosted zone from Route 53.
     * This hosted zone is used for the custom domain name of the API Gateway.
     * The hosted zone ID and name are stored in the config file.
     */
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "LeanstacksNetHostedZone", {
      hostedZoneId: CDK_AWS_HOSTED_ZONE_ID,
      zoneName: CDK_AWS_HOSTED_ZONE_NAME,
    });

    /**
     * Create A and AAAA records for the API Gateway in Route 53.
     * These records are used to route traffic to the API Gateway.
     */
    new route53.ARecord(this, "ApiARecord", {
      zone: hostedZone,
      recordName: "cdk-playground-api",
      target: route53.RecordTarget.fromAlias(new route53_targets.ApiGateway(api)),
    });

    new route53.AaaaRecord(this, "ApiAaaaRecord", {
      zone: hostedZone,
      recordName: "cdk-playground-api",
      target: route53.RecordTarget.fromAlias(new route53_targets.ApiGateway(api)),
    });

    /**
     * Create a new Lambda function for the "info" endpoint. There must be at least one resource in the API Gateway.
     */
    const infoFunctionLogGroup = new logs.LogGroup(this, "InfoFunctionLogGroup", {
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /**
     * Create a new Lambda function execution role.
     * This role is used by the Lambda function to write logs to CloudWatch.
     */
    const infoFunctionRole = new iam.Role(this, "InfoFunctionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")],
    });

    /**
     * Create a new Lambda function for the "info" endpoint.
     * This function returns the status of the API Gateway.
     */
    const infoFunction = new lambda_nodejs.NodejsFunction(this, "InfoFunction", {
      code: lambda.Code.fromInline(`
          exports.handler = async (event) => {
            return {
              statusCode: 200,
              body: JSON.stringify({
                status: "up",
                region: process.env.AWS_REGION,
              }),
            };
          };
        `),
      handler: "index.handler",
      logGroup: infoFunctionLogGroup,
      role: infoFunctionRole,
      runtime: lambda.Runtime.NODEJS_22_X,
    });

    /**
     * Add a resource to the API Gateway for the "info" path.
     */
    const infoResource = api.root.addResource("info");

    /**
     * Add a GET method to the "info" resource.
     * This method is integrated with the Lambda function created above.
     */
    infoResource.addMethod("GET", new apigateway.LambdaIntegration(infoFunction));

    /**
     * Stack Outputs
     * These outputs can be used to reference the values in other stacks.
     */
    new cdk.CfnOutput(this, "ApiId", {
      value: api.restApiId,
      description: "The ID of the API Gateway",
      exportName: "ApiId",
    });

    new cdk.CfnOutput(this, "ApiRootResourceId", {
      value: api.restApiRootResourceId,
      description: "The root resource ID of the API Gateway",
      exportName: "ApiRootResourceId",
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: "The URL of the API Gateway",
      exportName: "ApiUrl",
    });

    new cdk.CfnOutput(this, "ApiDomainName", {
      value: api.domainName?.domainName || "",
      description: "The domain name of the API Gateway",
      exportName: "ApiDomainName",
    });
  }
}
