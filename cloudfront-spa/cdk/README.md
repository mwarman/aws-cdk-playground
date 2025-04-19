# Using AWS CDK with the CloudFront SPA Example

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## Configuration

The CDK application is configured using environment variables. These values are injected into the CDK app during the build. The environment variables may be sourced from the environment or from a `.env` file located in the `/cdk` directory.

### Variables

| Key                  | Description                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------- |
| CDK_ENV              | The environment code. One of 'dev', 'qa', or 'prod'.                                          |
| CDK_CERTIFICATE_ARN  | The ARN of the ACM certificate to associate with the CloudFront distribution alias.           |
| CDK_HOSTED_ZONE_ID   | The identifier of the Route 53 hosted zone associated with the CloudFront distribution alias. |
| CDK_HOSTED_ZONE_NAME | The name of the Route 53 hosted zone associated with the CloudFront distribution alias.       |

### Example `.env`

```
CDK_ENV=dev
CDK_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/3d110b0f-8b3d-4ddc-bbd8-fab08ae6f038
CDK_HOSTED_ZONE_ID=1234567890123456
CDK_HOSTED_ZONE_NAME=example.com
```
