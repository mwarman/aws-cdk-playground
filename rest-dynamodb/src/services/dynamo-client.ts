import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { AWS_REGION } from "@/utils/config";

const marshallOptions = {
  convertClassInstanceToMap: true,
  convertEmptyValues: false,
  removeUndefinedValues: true,
};
const unmarshallOptions = {
  wrapNumbers: false,
};
const translateConfig = {
  marshallOptions,
  unmarshallOptions,
};

const dynamoDbClientConfig: DynamoDBClientConfig = {
  region: AWS_REGION,
};

const ddbClient = new DynamoDBClient(dynamoDbClientConfig);
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

const putItem = (input: PutCommandInput): Promise<PutCommandOutput> => {
  return ddbDocClient.send(new PutCommand(input));
};

const queryItems = (input: QueryCommandInput): Promise<QueryCommandOutput> => {
  return ddbDocClient.send(new QueryCommand(input));
};

const scanItems = (input: ScanCommandInput): Promise<ScanCommandOutput> => {
  return ddbDocClient.send(new ScanCommand(input));
};

export const DynamoClient = {
  putItem,
  queryItems,
  scanItems,
};
