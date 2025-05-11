import { ZodSchema } from "zod";

/**
 * Validate the data against the provided schema
 * @template TData - The type of the data to be validated
 * @template TResult - The type of the result after validation
 * @param schema - The Zod schema to validate the data against
 * @param data - The data to be validated
 * @returns TResult - The validated data
 * @throws Error - If the data is invalid, an error will be thrown with details about the validation failure
 */
export const validate = <TData, TResult>(schema: ZodSchema, data: TData): TResult => {
  // Parse the data using the provided schema
  // This will validate the data and return the parsed result if valid
  // If the data is invalid, it will throw an error with details about the validation failure
  // The `safeParse` method is used to avoid throwing an error immediately
  // Instead, it returns an object with a success property and either the parsed data or the error
  // The `success` property indicates whether the parsing was successful
  // If the parsing was successful, the `data` property contains the parsed data
  // If the parsing failed, the `error` property contains details about the validation failure
  const result = schema.safeParse(data);

  if (!result.success) {
    const message = `Validation error. ${result.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ")}`;
    throw new Error(message);
  }

  return result.data;
};
