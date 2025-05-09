import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { UserService } from "@/services/user-service";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log("UsersList::handler::", { event, env: process.env });

    // Fetch the list of users from the database
    const users = await UserService.list();

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    // Handle errors
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
