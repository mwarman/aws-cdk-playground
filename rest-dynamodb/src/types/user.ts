/**
 * Keys type definition
 * @typedef {Object} Keys
 * @property {string} pk - The partition key for the DynamoDB table
 * @property {string} [sk] - The sort key for the DynamoDB table (optional)
 */
export type Keys = {
  pk: string;
  sk?: string;
};

/**
 * User type definition
 * @typedef {Object} User
 * @property {string} userId - The unique identifier for the user
 * @property {string} firstName - The first name of the user
 * @property {string} lastName - The last name of the user
 * @property {string} email - The email address of the user
 * @property {string} createdAt - The date and time when the user was created
 * @property {string} updatedAt - The date and time when the user was last updated
 */
export type User = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * UserItem type definition representing a user in the DynamoDB table
 * @typedef {Object} UserItem
 * @property {Keys} keys - The keys for the DynamoDB table
 * @property {User} user - The user object
 */
export type UserItem = Keys & User;

/**
 * CreateUserDTO type definition for creating a new user
 * @typedef {Omit<User, "userId" | "createdAt" | "updatedAt">} CreateUserDTO
 */
export type CreateUserDTO = Omit<User, "userId" | "createdAt" | "updatedAt">;

/**
 * UpdateUserDTO type definition for updating an existing user
 * @typedef {Pick<User, "userId" | "firstName" | "lastName" | "email">} UpdateUserDTO
 */
export type UpdateUserDTO = Pick<User, "userId" | "firstName" | "lastName" | "email">;
