import { z } from "zod"; // Import zod for schema validation

/**
 * Configuration schema for the application.
 * This schema defines the expected environment variables and their types.
 * It uses zod for validation and provides default values.
 * If the validation fails, an error is thrown with a detailed message.
 */
const configSchema = z.object({
  AWS_REGION: z.string().default("us-east-1"),
  TABLE_NAME_USER: z.string().default("User"),
});

const config = configSchema.safeParse(process.env);
if (!config.success) {
  const message = `Invalid configuration: ${config.error.errors
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join(", ")}`;
  console.error(message);
  throw new Error(message);
}

export const { AWS_REGION, TABLE_NAME_USER } = config.data;
