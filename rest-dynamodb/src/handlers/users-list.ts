import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import UserService from "@/services/user-service";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("UsersList::handler::", { event });
  console.log("UsersList::handler::env::", { env: process.env });

  try {
    // Validate the event

    // Fetch the list of users from the database
    const users = await UserService.list();

    // Format the response
    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error("UsersList::error::", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving user list",
        error: errorMessage,
      }),
    };
  }
};
