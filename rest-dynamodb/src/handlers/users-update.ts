import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

import { UserService } from "@/services/user-service";
import { UpdateUserDTO } from "@/types/user";
import { validate } from "@/utils/validation";

/**
 * Zod schema for validating the request
 */
const requestSchema = z
  .object({
    body: z.object({
      userId: z.string().min(1, "userId is required"),
      firstName: z.string().min(1, "firstName is required"),
      lastName: z.string().min(1, "lastName is required"),
      email: z.string().email("valid email is required"),
    }),
    pathParameters: z.object({
      userId: z.string().min(1, "userId path variable is required"),
    }),
  })
  .refine(
    (data) => {
      return data.pathParameters.userId === data.body.userId;
    },
    {
      message: "userId in path and body must match",
    }
  );
type Request = z.infer<typeof requestSchema>;

/**
 * Handler for updating a user
 * @param event - The API Gateway event
 * @returns The API Gateway response
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log("UsersUpdate::handler::", { event, env: process.env });

    // Validate the event
    event.body = event.body ? JSON.parse(event.body) : {};
    event.pathParameters = event.pathParameters || {};
    const request = validate<APIGatewayProxyEvent, Request>(requestSchema, event);
    console.log("UsersUpdate::request::", { request });

    // Update the user in the database
    const userId = request.pathParameters.userId;
    const userToUpdate = request.body as UpdateUserDTO;
    const user = await UserService.update({ ...userToUpdate, userId });

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
    console.error("UsersUpdate::error::", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error updating user",
        error: errorMessage,
      }),
    };
  }
};
