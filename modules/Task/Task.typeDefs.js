const { gql } = require('apollo-server-express');

const typeDefs = gql`
    scalar Date

    enum TaskType {
        Assign_Corrector
        Enter_Marks
        Validate_Marks
    }

    enum TaskStatus {
        PENDING
        IN_PROGRESS
        COMPLETED
    }

    type Task {
        id: ID!
        test_id: ID!
        user_id: ID!
        task_type: TaskType!
        task_status: TaskStatus!
        due_date: Date!
        created_by: ID
        updated_by: ID
        deleted_by: ID
        Created_At: Date
        Updated_At: Date
    }

    type StudentTestResult {
        id: ID!
        student_id: ID!
        test_id: ID!
        marks: [MarkEntry!]!
        average_mark: Float!
        mark_entry_date: Date!
    }

    type MarkEntry {
        notation_text: String!
        mark: Float!
    }

    input AssignCorrectorInput {
        task_id: ID!
        corrector_id: ID!
    }

    input MarkEntryInput {
        notation_text: String!
        mark: Float!
    }

    input EnterMarksInput {
        test_id: ID!
        student_id: ID!
        marks: [MarkEntryInput!]!
    }

    input ValidateMarksInput {
        task_id: ID!
    }

    type Query {
        GetTasksByUser(user_id: ID!): [Task!]!
        GetTasksByTest(test_id: ID!): [Task!]!
    }

    type Mutation {
        AssignCorrector(input: AssignCorrectorInput!): Task!
        EnterMarks(input: EnterMarksInput!): StudentTestResult!
        ValidateMarks(input: ValidateMarksInput!): Task!
    }
`;

module.exports = typeDefs;
