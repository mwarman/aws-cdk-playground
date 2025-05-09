import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

import { UserService } from "@/services/user-service";

const validate = (event: APIGatewayProxyEvent): void => {
  const schema = z.object({
    pathParameters: z.object({
      userId: z.string().min(1, "userId path variable is required"),
    }),
  });

  const result = schema.safeParse(event);
  if (!result.success) {
    const message = `Invalid request: ${result.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ")}`;
    throw new Error(message);
  }
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log("UsersFind::handler::", { event, env: process.env });

    // Validate the event
    validate(event);

    // Fetch the list of users from the database
    const userId = event.pathParameters?.userId;
    const user = await UserService.findById(userId);

    // Check if the user exists
    if (user) {
      // Return success response
      return {
        statusCode: 200,
        body: JSON.stringify(user),
      };
    } else {
      return {
        statusCode: 404,
        body: "",
      };
    }
  } catch (error) {
    // Handle errors
    console.error("UsersFind::error::", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving user",
        error: errorMessage,
      }),
    };
  }
};
