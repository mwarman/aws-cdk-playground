import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

import { CreateUserDTO } from "@/types/user";
import { UserService } from "@/services/user-service";

const validate = (event: APIGatewayProxyEvent): void => {
  const schema = z.object({
    body: z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
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
    console.log("UsersCreate::handler::", { event, env: process.env });

    // Validate the event
    event.body = event.body ? JSON.parse(event.body) : {};
    validate(event);

    // Create a new user
    const userToCreate = event.body as unknown as CreateUserDTO;
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
