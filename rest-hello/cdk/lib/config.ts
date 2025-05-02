import "dotenv/config"; // Load environment variables from .env file
import { z } from "zod";

// This file is used to validate the environment variables used in the CDK stack.
// It uses the zod library to define a schema for the environment variables
// and validate them at runtime. If the environment variables are not valid,
// an error is thrown with a message indicating which variables are invalid.
// This is useful for catching configuration errors early in the deployment process.
// The environment variables are loaded from a .env file using the dotenv library.
// The .env file should be located in the '/cdk' directory of the project.
const configSchema = z.object({
  CDK_ENV: z.enum(["dev", "qa", "prod"]).default("dev"),
});

const config = configSchema.safeParse(process.env);
if (!config.success) {
  const message = `Invalid configuration: ${config.error.errors
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join(", ")}`;
  console.error(message);
  throw new Error(message);
}

export const { CDK_ENV } = config.data;
