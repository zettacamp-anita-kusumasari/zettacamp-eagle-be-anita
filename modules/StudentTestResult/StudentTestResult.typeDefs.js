// *************** IMPORT LIBRARY ***************
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  enum StudentTestResultStatus {
    IN_PROGRESS
    GRADED
    DELETED
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Student {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Test {
    id: ID!
    name: String!
    description: String
  }

  type MarkEntry {
    notation_text: String!
    mark: Float!
  }

  type StudentTestResult {
    id: ID!
    student_id: ID!
    student: Student
    test_id: ID!
    test: Test
    user_id: ID!
    marks: [MarkEntry!]
    average_mark: Float!
    mark_entry_date: Date!
    student_test_result_status: StudentTestResultStatus!
    created_by: User
    created_at: Date
    updated_by: User
    updated_at: Date
    deleted_by: User
    deleted_at: Date
  }

  input MarkInput {
    notation_text: String!
    mark: Float!
  }

  input UpdateStudentTestResultInput {
    marks: [MarkInput!]!
    average_mark: Float!
    mark_entry_date: Date!
    student_test_result_status: StudentTestResultStatus!
    user_id: ID!
  }

  type Query {
    GetAllStudentTestResults(
      student_test_result_status: StudentTestResultStatus
      test_id: ID!
      student_id: ID!
    ): [StudentTestResult!]!
    GetOneStudentTestResult(id: ID!): StudentTestResult
  }

  type Mutation {
    UpdateStudentTestResult(
      id: ID!
      input: UpdateStudentTestResultInput!
    ): StudentTestResult!
    DeleteStudentTestResult(id: ID!, user_id: ID!): StudentTestResult!
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
