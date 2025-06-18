// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type Contact {
    email: String!
    phone_number: String!
  }

  enum UserStatus {
    ACTIVE
    PENDING
    DELETED
  }

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    photo_profile: String
    contact: Contact!
    role: String!
    user_status: UserStatus!
    created_by: User
    updated_by: User
    deleted_by: User
    created_at: Date
    updated_at: Date
    deleted_at: Date
  }

  input ContactInput {
    email: String!
    phone_number: String!
  }

  input CreateUserInput {
    first_name: String!
    last_name: String!
    photo_profile: String
    contact: ContactInput!
    role: String!
    user_status: UserStatus!
    password: String!
  }

  input UpdateUserInput {
    first_name: String!
    last_name: String!
    photo_profile: String
    contact: ContactInput!
    role: String!
    user_status: UserStatus!
    password: String!
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
