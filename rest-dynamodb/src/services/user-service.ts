import { PutCommandInput } from "@aws-sdk/lib-dynamodb";

import { CreateUserDTO, User } from "@/types/user";
import { DynamoClient } from "./dynamo-client";
import { ID } from "@/utils/id";
import { TABLE_NAME_USER } from "@/utils/config";
import { DETAIL_KEY, USER_KEY } from "@/utils/constants";

const create = async (user: CreateUserDTO): Promise<User> => {
  console.log("UserService::create::user::", { user });
  // Create a new user
  // Generate a unique userId and set createdAt and updatedAt timestamps
  const now = new Date().toISOString();
  const newUser = {
    ...user,
    userId: ID.generate(),
    createdAt: now,
    updatedAt: now,
  };

  // Create DynamoDB putItem input and add the new user to the database
  const putCommandInput: PutCommandInput = {
    TableName: TABLE_NAME_USER,
    Item: {
      pk: `${USER_KEY}#${newUser.userId}`,
      sk: DETAIL_KEY,
      ...newUser,
    },
  };
  console.log("UserService::create::putCommandInput", { putCommandInput });
  await DynamoClient.putItem(putCommandInput);

  // Return the new user object
  return newUser;
};

const list = async (): Promise<User[]> => {
  console.log("UserService::list");
  // List all users
  // Create DynamoDB scan input and fetch all users from the database
  const output = await DynamoClient.scanItems({
    TableName: TABLE_NAME_USER,
  });

  // Map the items to the User type and return
  const items = output.Items as User[];
  return items;
};

export const UserService = {
  create,
  list,
};
