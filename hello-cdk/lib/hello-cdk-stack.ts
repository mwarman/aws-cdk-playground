import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from "aws-cdk-lib/aws-lambda";

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'HelloCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // Define a Lambda function
    const helloWorldLambda = new lambda.Function(this, "HelloWorldFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          return {
            statusCode: 200,
            body: JSON.stringify('Hello CDK!'),
          };
        };
      `),
    });

    // Define a Lambda function URL
    const helloWorldFunctionUrl = helloWorldLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE, // No authentication
    });

    // Define a CloudFormation output for the Lambda function URL
    new cdk.CfnOutput(this, "HelloWorldFunctionUrl", {
      value: helloWorldFunctionUrl.url,
      description: "The URL of the Hello World Lambda function",
      exportName: "HelloWorldFunctionUrl",
    });
  }
}
