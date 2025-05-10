import { GetCommandInput, PutCommandInput, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { map, omit } from "lodash";

import { CreateUserDTO, UpdateUserDTO, User, UserItem } from "@/types/user";
import { DynamoClient } from "./dynamo-client";
import { ID } from "@/utils/id";
import { TABLE_NAME_USER } from "@/utils/config";
import { DETAIL_KEY, USER_KEY } from "@/utils/constants";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";

const findById = async (userId: string): Promise<User | null> => {
  console.log("UserService::findById::userId::", { userId });
  // Find a user by userId
  // Create DynamoDB getItem input and fetch the user from the database
  const getCommandInput: GetCommandInput = {
    TableName: TABLE_NAME_USER,
    Key: {
      pk: `${USER_KEY}#${userId}`,
      sk: DETAIL_KEY,
    },
  };
  console.log("UserService::findById::getCommandInput", { getCommandInput });
  const output = await DynamoClient.getItem(getCommandInput);
  console.log("UserService::findById::output", { output });

  // Check if the user exists
  if (!output.Item) {
    console.log("UserService::findById::user not found");
    return null;
  }

  // Map the output to the User type and return
  const userItem = output.Item as UserItem;
  const user: User = omit(userItem, ["pk", "sk"]);
  console.log("UserService::findById::user", { user });
  return user;
};

const list = async (): Promise<User[]> => {
  console.log("UserService::list");
  // List all users
  // Create DynamoDB scan input and fetch all users from the database
  const output = await DynamoClient.scanItems({
    TableName: TABLE_NAME_USER,
  });

  // Map the items to the User type and return
  const userItems = output.Items as UserItem[];
  const users = map<UserItem, User>(userItems, (item) => omit(item, ["pk", "sk"]));
  return users;
};

const create = async (user: CreateUserDTO): Promise<User> => {
  console.log("UserService::create::user::", { user });
  // Create a new user
  // Generate a unique userId and set createdAt and updatedAt timestamps
  const now = new Date().toISOString();
  const newUser: User = {
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

const update = async (user: UpdateUserDTO): Promise<User | null> => {
  try {
    console.log("UserService::update::user::", { user });

    // Update an existing user
    const now = new Date().toISOString();

    // Create DynamoDB updateItem input and update the user in the database
    const updateCommandInput: UpdateCommandInput = {
      TableName: TABLE_NAME_USER,
      Key: {
        pk: `${USER_KEY}#${user.userId}`,
        sk: DETAIL_KEY,
      },
      UpdateExpression: "set #firstName = :firstName, #lastName = :lastName, #email = :email, #updatedAt = :updatedAt",
      ConditionExpression: "attribute_exists(pk)",
      ExpressionAttributeNames: {
        "#firstName": "firstName",
        "#lastName": "lastName",
        "#email": "email",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":firstName": user.firstName,
        ":lastName": user.lastName,
        ":email": user.email,
        ":updatedAt": now,
      },
      ReturnValues: "NONE",
    };
    console.log("UserService::update::updateCommandInput", { updateCommandInput });
    await DynamoClient.updateItem(updateCommandInput);

    // Fetch the updated user from the database
    return await findById(user.userId);
  } catch (error) {
    console.error("UserService::update::error", { error });
    // Handle errors
    if (error instanceof ConditionalCheckFailedException) {
      // Item not found
      console.log("UserService::update::user not found");
      return null;
    }
    throw error;
  }
};

const deleteById = async (userId: string): Promise<void> => {
  console.log("UserService::deleteById::userId::", { userId });
  // Delete a user by userId
  // Create DynamoDB deleteItem input and remove the user from the database
  const deleteCommandInput = {
    TableName: TABLE_NAME_USER,
    Key: {
      pk: `${USER_KEY}#${userId}`,
      sk: DETAIL_KEY,
    },
  };
  console.log("UserService::deleteById::deleteCommandInput", { deleteCommandInput });
  await DynamoClient.deleteItem(deleteCommandInput);
  console.log("UserService::deleteById::user deleted");
};

export const UserService = {
  create,
  deleteById,
  findById,
  list,
  update,
};
