// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    role: String!
    password: String!
    created_at: Date!
    updated_at: Date!
  }

  input CreateUserInput {
    first_name: String!
    last_name: String!
    email: String!
    role: String!
    password: String!
  }

  input UpdateUserInput {
    first_name: String
    last_name: String
    email: String
    role: String
    password: String
  }

  type Query {
    GetAllUsers: [User!]!
    GetOneUser(id: ID!): User
  }

  type Mutation {
    CreateUser(input: CreateUserInput): User
    UpdateUser(id: ID!, input: UpdateUserInput): User
    DeleteUser(id: ID!): User
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
