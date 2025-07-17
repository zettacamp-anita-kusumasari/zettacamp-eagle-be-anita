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
    IN_PROGRESS
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
    student_test_result_ids: StudentTestResult
    created_by: User
    updated_by: User
    deleted_by: User
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

  type StudentTestResult {
    id: ID!
    student_id: Student
    test_id: Test
    marks: [MarkEntry!]!
    average_mark: Float!
    average_marks: [AverageMark!]!
    mark_entry_date: Date!
  }

  type MarkEntry {
    notation_text: String!
    mark: Float!
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
    EnterMarks(_id: ID!, input: EnterMarksInput!): Task!
    ValidateMarks(_id: ID!): Task!
    DeleteTask(_id: ID!): ID!
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
