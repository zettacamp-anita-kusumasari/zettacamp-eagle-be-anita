// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

/**
 * GraphQL Schema Definitions using gql template literal.
 *
 * Scalars:
 * @scalar Date - Custom scalar type to represent date values.
 *
 * Types:
 * @type User
 * @property {ID!} id - Unique identifier for the user.
 * @property {String!} firstName - First name of the user.
 * @property {String!} lastName - Last name of the user.
 * @property {String!} email - Email address of the user.
 * @property {String!} role - Role assigned to the user (e.g., admin, teacher).
 * @property {Date} deletedAt - Timestamp for soft delete (null if not deleted).
 *
 * Queries:
 * @query users - Retrieve all users.
 * @query user(id: ID!) - Retrieve a user by ID.
 *
 * Mutations:
 * @mutation createUser - Create a new user.
 *   @param {String!} firstName - First name of the user.
 *   @param {String!} lastName - Last name of the user.
 *   @param {String!} email - Email address of the user.
 *   @param {String!} role - Role of the user.
 *   @returns {User}
 *
 * @mutation updateUser - Update an existing user by ID.
 *   @param {ID!} id - ID of the user to update.
 *   @param {String} firstName - New first name (optional).
 *   @param {String} lastName - New last name (optional).
 *   @param {String} email - New email (optional).
 *   @param {String} role - New role (optional).
 *   @returns {User}
 *
 * @mutation deleteUser - Soft delete a user by ID.
 *   @param {ID!} id - ID of the user to delete.
 *   @returns {User}
 */
const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    password: String!
  }

  input Mutation_CreateUser {
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    password: String!
  }

  input Mutation_UpdateUser {
    firstName: String
    lastName: String
    email: String
    role: String
    password: String
  }

  type Query {
    GetAllUsers: [User]
    GetOneUser(id: ID!): User
  }

  type Mutation {
    createUser(input: Mutation_CreateUser): User
    updateUser(id: ID!, input: Mutation_UpdateUser): User
    deleteUser(id: ID!): User
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;