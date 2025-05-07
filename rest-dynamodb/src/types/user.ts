/**
 * User type definition
 * @typedef {Object} User
 * @property {string} id - The unique identifier for the user
 * @property {string} firstName - The first name of the user
 * @property {string} lastName - The last name of the user
 * @property {string} email - The email address of the user
 * @property {string} createdAt - The date and time when the user was created
 * @property {string} updatedAt - The date and time when the user was last updated
 */
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};
