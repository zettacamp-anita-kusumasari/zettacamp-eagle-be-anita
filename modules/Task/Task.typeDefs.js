const { gql } = require('apollo-server-express');

const typeDefs = gql`
    scalar Date

    enum TaskType {
        IN_PROGRESS
        GRADED
        DELETED
    }

    enum TaskStatus {
        IN_PROGRESS
        GRADED
        DELETED
    }

    type Test {
        id: ID!
        name: String!
        description: String
    }
    
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
    }

    type Task {
        id: ID!
        test_id: Test
        user_id: User
        task_type: TaskType!
        task_status: TaskStatus!
        due_date: Date!
        created_by: User
        created_at: Date
        updated_by: User
        updated_at: Date 
        deleted_by: User
        deleted_at: Date
    }

    input CreateTaskInput {
        task_type: TaskType!
        task_status: TaskStatus!
        due_date: Date!

    }

    input UpdateTaskInput {
        task_type: TaskType!
        task_status: TaskStatus!
        due_date: Date!

    }

    type Query {
        GetAllTasks: [Task!]!
        GetOneTask(id: ID!): Task
    }

    type Mutation {
        UpdateTask(id: ID!, input: UpdateTaskInput!): Task!
        DeleteTask(id: ID!): Task!
        AssignCorrector
        EnterMark
        ValidateMark
    }
`;

module.exports = typeDefs;
