import { randomBytes } from "crypto";

/**
 * Default identifier length.
 */
const ID_LENGTH_DEFAULT = 16;
/**
 * Minimum identifier length.
 */
const ID_LENGTH_MINIMUM = 1;
/**
 * Maximum identifier length.
 */
const ID_LENGTH_MAXIMUM = 128;

/**
 * Generates a random alphanumeric value of specified length. If the `length` value is
 * not between the minimum and maximum values, the default length, 16, will be used.
 * @param length - Optional. The identifier length. Minimum 1. Maximum 128. Default: 16.
 * @returns A randomly generated alphanumeric identifer.
 */
const generate = (length = ID_LENGTH_DEFAULT): string => {
  let idLength = length;
  if (length < ID_LENGTH_MINIMUM || length > ID_LENGTH_MAXIMUM) {
    idLength = ID_LENGTH_DEFAULT;
  }
  const byteLength = Math.ceil(idLength / 2);
  return randomBytes(byteLength).toString("hex").substring(0, idLength);
};

/**
 * Utility functions for the creation and manipulation of identifier values.
 */
export const ID = {
  generate,
  ID_LENGTH_DEFAULT,
  ID_LENGTH_MAXIMUM,
  ID_LENGTH_MINIMUM,
};
