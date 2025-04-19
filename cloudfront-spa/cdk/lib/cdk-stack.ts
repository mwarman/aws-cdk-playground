import * as cdk from "aws-cdk-lib";
import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3_deployment from "aws-cdk-lib/aws-s3-deployment";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53_targets from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

export class CloudFrontSpaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Certificate for CloudFront
    const certificate = certificatemanager.Certificate.fromCertificateArn(
      this,
      "CloudFrontSpaCertificate",
      "arn:aws:acm:us-east-1:988218269141:certificate/3d110b0f-8b3d-4ddc-bbd8-fab08ae6f038"
    );

    // S3 bucket for the application
    const bucket = new s3.Bucket(this, "CloudFrontSpaBucket");

    // S3 bucket deployment
    const deployment = new s3_deployment.BucketDeployment(
      this,
      "CloudFrontSpaDeployment",
      {
        sources: [s3_deployment.Source.asset("../dist")],
        destinationBucket: bucket,
      }
    );

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(
      this,
      "CloudFrontSpaDistribution",
      {
        certificate: certificate,
        comment: "CDK Playground CloudFront SPA",
        defaultBehavior: {
          origin:
            cloudfront_origins.S3BucketOrigin.withOriginAccessControl(bucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
        domainNames: ["cdk-playground.dev.leanstacks.net"],
        errorResponses: [
          {
            httpStatus: 403,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.seconds(0),
            responseHttpStatus: 200,
          },
          {
            httpStatus: 404,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.seconds(0),
            responseHttpStatus: 200,
          },
        ],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      }
    );

    // Route 53 zone
    const zone = route53.PublicHostedZone.fromHostedZoneAttributes(
      this,
      "CloudFrontSpaZone",
      {
        hostedZoneId: "Z0551680JTSC5PSAEQQB",
        zoneName: "dev.leanstacks.net",
      }
    );

    // Route 53 A record
    const aRecord = new route53.ARecord(this, "CloudFrontSpaAliasRecordA", {
      zone: zone,
      recordName: "cdk-playground",
      target: route53.RecordTarget.fromAlias(
        new route53_targets.CloudFrontTarget(distribution)
      ),
    });

    // Route 53 AAAA record
    new route53.AaaaRecord(this, "CloudFrontSpaAliasRecordAAAA", {
      zone: zone,
      recordName: "cdk-playground",
      target: route53.RecordTarget.fromAlias(
        new route53_targets.CloudFrontTarget(distribution)
      ),
    });

    // Outputs
    new cdk.CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
      description: "CloudFront SPA S3 bucket name",
    });

    new cdk.CfnOutput(this, "DomainName", {
      value: aRecord.domainName,
      description: "CloudFront SPA Route 53 domain name",
    });
  }
}
