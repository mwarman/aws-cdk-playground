import { User } from "@/types/user";
import DynamoClient from "./dynamo-client";
import { TABLE_NAME_USER } from "@/utils/config";

const list = async (): Promise<User[]> => {
  console.log("UserService::list");
  const output = await DynamoClient.scanItems({
    TableName: TABLE_NAME_USER,
  });
  const items = output.Items as User[];

  // const users: User[] = [
  //   {
  //     id: "1",
  //     firstName: "John",
  //     lastName: "Doe",
  //     email: "j@doe.com",
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   },
  //   {
  //     id: "2",
  //     firstName: "Jane",
  //     lastName: "Doe",
  //     email: "jane@doe.com",
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   },
  // ]; // Replace with actual database call
  return items;
};

const UserService = {
  list,
};
export default UserService;
