const { gql } = require('apollo-server-express');

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

    type Mark {
        notation_text: String!
        mark: Float!
    }

    type StudentTestResult {
        id: ID!
        student_id: Student
        test_id: Test
        marks: [Mark!]
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
    }

    type Query {
        GetAllStudentTestResults: [StudentTestResult!]!
        GetOneStudentTestResult(id: ID!): StudentTestResult
    }

    type Mutation {
        UpdateStudentTestResult(id: ID!, input: UpdateStudentTestResultInput!): StudentTestResult!
        DeleteStudentTestResult(id: ID!): StudentTestResult!
    }
`;

module.exports = typeDefs;
