import { z } from "zod";

import { validate } from "./validation";

/**
 * Configuration schema for the application.
 * This schema defines the expected environment variables and their types.
 */
const configSchema = z.object({
  AWS_REGION: z.string().default("us-east-1"),
  TABLE_NAME_USER: z.string().default("User"),
});
type Config = z.infer<typeof configSchema>;

/**
 * Configuration object for the application.
 * This object is created by validating the environment variables against the configSchema.
 * If the validation fails, an error is thrown with a detailed message.
 */
export const config = validate<NodeJS.ProcessEnv, Config>(configSchema, process.env);
