// *************** IMPORT LIBRARY ***************
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  enum TestStatus {
    NOT_PUBLISHED
    PUBLISHED
    DELETED
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Subject {
    id: ID!
    name: String!
    description: String!
    coefficient: Float!
  }

  type Notation {
    notation_text: String!
    max_point: Float!
  }

  type Test {
    _id: ID!
    subject_id: Subject
    user_id: ID!
    name: String!
    description: String!
    weight: Float!
    notations: [Notation!]!
    test_status: TestStatus!
    for_retake: Boolean!
    published_by: User
    published_date: Date
    created_by: User
    created_at: Date
    updated_by: User
    updated_at: Date
    deleted_by: User
    deleted_at: Date
  }

  input NotationInput {
    notation_text: String!
    max_point: Float!
  }

  input CreateTestInput {
    user_id: ID!
    name: String!
    description: String!
    weight: Float!
    notations: [NotationInput!]!
    test_status: TestStatus!
    for_retake: Boolean!
    published_date: Date
  }

  input UpdateTestInput {
    user_id: ID!
    name: String
    description: String
    weight: Float
    notations: [NotationInput!]
    test_status: TestStatus!
    for_retake: Boolean!
    published_date: Date
  }

  input PublishTestInput {
    user_id: ID!
    name: String!
    description: String
    weight: Float!
    notations: [NotationInput!]!
    test_status: TestStatus!
    for_retake: Boolean!
    published_date: Date
  }

  type Query {
    GetAllTests: [Test!]!
    GetOneTest(id: ID!): Test
  }

  type Mutation {
    CreateTest(input: CreateTestInput!): Test!
    PublishTest(id: ID!, input: PublishTestInput!): Test!
    UpdateTest(id: ID!, input: UpdateTestInput!): Test!
    DeleteTest(id: ID!, user_id: ID!): Test!
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
