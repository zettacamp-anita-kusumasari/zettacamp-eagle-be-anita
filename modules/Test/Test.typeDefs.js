// *************** IMPORT LIBRARY ***************
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  enum TestStatus {
    NOT_PUBLISHED
    PUBLISHED
    DELETED
  }

  type Notation {
    notation_text: String!
    max_point: Float!
  }

  type Test {
    _id: ID!
    subject_id: Subject
    name: String!
    description: String!
    weight: Float!
    notations: [Notation!]!
    test_status: TestStatus!
    for_retake: Boolean!
    published_by: User
    published_date: Date
    created_by: ID
    created_at: Date
    updated_by: ID
    updated_at: Date
    deleted_by: ID
    deleted_at: Date
  }

  type PublishTestPayload {
    updatedTest: ReturnTest!
    assignTask: ReturnTask!
  }

  type ReturnTest {
    _id: ID!
    test_status: TestStatus!
    published_date: Date
  }

  type ReturnTask {
    _id: ID!
    test_id: Test
    task_type: TaskType
    task_status: TaskStatus
    due_date: Date
  }

  input NotationInput {
    notation_text: String!
    max_point: Float!
  }

  input CreateTestInput {
    subject_id: ID
    name: String!
    description: String!
    weight: Float!
    notations: [NotationInput!]!
    test_status: TestStatus!
    for_retake: Boolean!
    published_date: Date
  }

  input UpdateTestInput {
    subject_id: ID
    name: String
    description: String
    weight: Float
    notations: [NotationInput!]
    test_status: TestStatus!
    for_retake: Boolean!
    published_date: Date
  }

  input PublishTestInput {
    test_status: TestStatus!
  }

  type Query {
    GetAllTests: [Test!]!
    GetOneTest(_id: ID!): Test
  }

  type Mutation {
    CreateTest(created_by: ID!, input: CreateTestInput!): Test!
    PublishTest(_id: ID!): PublishTestPayload!
    UpdateTest(_id: ID!, updated_by: ID!, input: UpdateTestInput!): Test!
    DeleteTest(_id: ID!): ID!
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
