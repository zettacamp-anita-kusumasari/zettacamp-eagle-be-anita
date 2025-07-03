const { gql } = require('apollo-server-express');

const typeDefs = gql`
    scalar Date

    enum TestStatus {
        TO_DO
        FINISHED
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
        id: ID!
        subject_id: Subject
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
        name: String!
        description: String!
        weight: Float!
        notations: [NotationInput!]!
        test_status: TestStatus!
        for_retake: Boolean!
        published_date: Date
    }

    input UpdateTestInput {
        name: String
        description: String
        weight: Float
        notations: [NotationInput!]
        test_status: TestStatus!
        for_retake: Boolean!
        published_date: Date
    }

    input PublishTestInput {
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
        DeleteTest(id: ID!): Test!
    }
`;

module.exports = typeDefs;
