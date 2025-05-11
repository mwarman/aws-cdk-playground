import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

import { CreateUserDTO } from "@/types/user";
import { UserService } from "@/services/user-service";
import { validate } from "@/utils/validation";

/**
 * Zod schema for validating the request
 */
const requestSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
  }),
});
type Request = z.infer<typeof requestSchema>;

/**
 * Handler for creating a new user
 * @param event - The API Gateway event
 * @returns The API Gateway response
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log("UsersCreate::handler::", { event, env: process.env });

    // Validate the event
    event.body = event.body ? JSON.parse(event.body) : {};
    const request = validate<APIGatewayProxyEvent, Request>(requestSchema, event);
    console.log("UsersCreate::request::", { request });

    // Create a new user
    const userToCreate = request.body as CreateUserDTO;
    const user = await UserService.create(userToCreate);

    // Return success response
    return {
      statusCode: 201,
      body: JSON.stringify(user),
    };
  } catch (error) {
    // Handle errors
    console.error("UsersCreate::error::", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating user",
        error: errorMessage,
      }),
    };
  }
};
