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
    console.log("UsersDelete::handler::", { event, env: process.env });

    // Validate the event
    const request = validate<APIGatewayProxyEvent, Request>(requestSchema, event);
    console.log("UsersDelete::request::", { request });

    // Delete the user from the database
    const userId = request.pathParameters.userId;
    await UserService.deleteById(userId);

    // Return success response
    return {
      statusCode: 204,
      body: "",
    };
  } catch (error) {
    // Handle errors
    console.error("UsersDelete::error::", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error deleting user",
        error: errorMessage,
      }),
    };
  }
};
