import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  DeleteCommand,
  DeleteCommandInput,
  DeleteCommandOutput,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
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

const deleteItem = (input: DeleteCommandInput): Promise<DeleteCommandOutput> => {
  return ddbDocClient.send(new DeleteCommand(input));
};

const getItem = (input: GetCommandInput): Promise<GetCommandOutput> => {
  return ddbDocClient.send(new GetCommand(input));
};

const putItem = (input: PutCommandInput): Promise<PutCommandOutput> => {
  return ddbDocClient.send(new PutCommand(input));
};

const scanItems = (input: ScanCommandInput): Promise<ScanCommandOutput> => {
  return ddbDocClient.send(new ScanCommand(input));
};

const updateItem = (input: UpdateCommandInput): Promise<UpdateCommandOutput> => {
  return ddbDocClient.send(new UpdateCommand(input));
};

export const DynamoClient = {
  deleteItem,
  getItem,
  putItem,
  scanItems,
  updateItem,
};
