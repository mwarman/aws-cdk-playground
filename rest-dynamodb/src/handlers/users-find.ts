import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

import { UserService } from "@/services/user-service";
import { validate } from "@/utils/validation";

/**
 * Zod schema for validating the request
 */
const requestSchema = z.object({
  pathParameters: z.object({
    userId: z.string().min(1, "userId path variable is required"),
  }),
});
type Request = z.infer<typeof requestSchema>;

/**
 * Handler for deleting a user
 * @param event - The API Gateway event
 * @returns The API Gateway response
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log("UsersFind::handler::", { event, env: process.env });

    // Validate the event
    const request = validate<APIGatewayProxyEvent, Request>(requestSchema, event);
    console.log("UsersFind::request::", { request });

    // Find the user in the database
    const userId = request.pathParameters.userId;
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
