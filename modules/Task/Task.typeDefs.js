// *************** IMPORT LIBRARY ***************
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  enum TaskType {
    ASSIGN_CORRECTOR
    ENTER_MARKS
    VALIDATE_MARKS
  }

  enum TaskStatus {
    PENDING
    COMPLETED
    DELETED
  }

  type Task {
    _id: ID!
    test_id: Test
    user_id: ID
    student_id: Student
    task_type: TaskType!
    task_status: TaskStatus!
    due_date: Date!
    created_by: ID
    updated_by: ID
    deleted_by: ID
    created_at: Date
    updated_at: Date
    deleted_at: Date
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type AverageMark {
    notation_text: String!
    average_mark: Float!
  }

  type MarkEntry {
    notation_text: String!
    mark: Float!
  }

  type EnterMarkPayload {
    validateMarksTask: ReturnTask!
    createStudentTestResult: ReturnStudentTestResult!
  }

  type ReturnTask {
    _id: ID
    task_type: TaskType
    task_status: TaskStatus
    due_date: Date
    test_id: Test
  }

  type ReturnStudentTestResult {
    _id: ID
    marks: [MarkEntry!]!
    average_mark: Float
    mark_entry_date: Date
  }

  input UpdateTaskInput {
    task_type: TaskType!
    task_status: TaskStatus!
    due_date: Date!
  }

  input MarkEntryInput {
    notation_text: String!
    mark: Float!
  }

  input EnterMarksInput {
    test_id: ID
    student_id: ID
    marks: [MarkEntryInput!]!
  }

  type Query {
    GetAllTasks: [Task!]!
    GetOneTask(id: ID!): Task!
  }

  type Mutation {
    UpdateTask(id: ID!, input: UpdateTaskInput!): Task!
    AssignCorrector(_id: ID!): Task!
    EnterMarks(_id: ID!, input: EnterMarksInput!): EnterMarkPayload!
    ValidateMarks(_id: ID!): Task!
    DeleteTask(_id: ID!): ID!
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
