// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    password: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    password: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    role: String
    password: String
  }

  type Query {
    getAllUsers: [User]
    getOneUser(id: ID!): User
  }

  type Mutation {
    createUser(input: CreateUserInput): User
    updateUser(id: ID!, input: UpdateUserInput): User
    deleteUser(id: ID!): User
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
