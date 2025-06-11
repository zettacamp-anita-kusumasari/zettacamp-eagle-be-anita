// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

/**
 * GraphQL Schema Definitions using gql template literal.
 *
 * Scalars:
 * @scalar Date - Custom scalar type to represent date values.
 *
 * @type User
 * @property {ID!} id - Unique identifier for the user.
 * @property {String!} firstName - First name of the user.
 * @property {String!} lastName - Last name of the user.
 * @property {String!} email - Email address of the user.
 * @property {String!} role - Role assigned to the user (e.g., admin, teacher).
 * @property {String!} password - Hashed password of the user.
 *
 * Inputs:
 * @input Mutation_CreateUser - Input type for creating a user.
 *   @field {String!} firstName
 *   @field {String!} lastName
 *   @field {String!} email
 *   @field {String!} role
 *   @field {String!} password
 *
 * @input Mutation_UpdateUser - Input type for updating a user.
 *   @field {String} firstName
 *   @field {String} lastName
 *   @field {String} email
 *   @field {String} role
 *   @field {String} password
 *
 * Queries:
 * @query GetAllUsers - Retrieve all users.
 * @query GetOneUser(id: ID!) - Retrieve a user by ID.
 *
 * Mutations:
 * @mutation createUser - Create a new user.
 *   @param {Mutation_CreateUser} input - User creation fields.
 *   @returns {User}
 *
 * @mutation updateUser - Update an existing user.
 *   @param {ID!} id - ID of the user to update.
 *   @param {Mutation_UpdateUser} input - Fields to update.
 *   @returns {User}
 *
 * @mutation deleteUser - Delete a user by ID.
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