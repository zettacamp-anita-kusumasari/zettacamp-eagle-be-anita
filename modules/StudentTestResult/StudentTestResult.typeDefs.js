// *************** IMPORT LIBRARY ***************
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type MarkEntry {
    notation_text: String!
    mark: Float!
  }

  type AverageMark {
    notation_text: String!
    average_mark: Float!
  }

  type StudentTestResult {
    _id: ID!
    student_id: Student
    test_id: Test
    marks: [MarkEntry!]!
    average_mark: Float!
    mark_entry_date: Date!
    updated_by: ID
    updated_at: Date
    deleted_by: ID
    deleted_at: Date
  }

  input MarkInput {
    notation_text: String!
    mark: Float!
  }

  input UpdateStudentTestResultInput {
    marks: [MarkInput!]!
  }

  type Query {
    GetAllStudentTestResults: [StudentTestResult!]!
    GetOneStudentTestResult(_id: ID!): StudentTestResult
  }

  type Mutation {
    UpdateStudentTestResult(
      _id: ID!
      input: UpdateStudentTestResultInput!
    ): StudentTestResult!
    DeleteStudentTestResult(_id: ID!): ID!
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
