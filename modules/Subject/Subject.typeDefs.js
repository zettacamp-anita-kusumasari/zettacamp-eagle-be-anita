// *************** IMPORT LIBRARY ***************
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  enum SubjectStatus {
    ACTIVE
    DELETED
  }

  type Subject {
    _id: ID!
    block_id: Block
    name: String!
    description: String!
    coefficient: Float!
    test_ids: [Test]
    subject_code: String!
    subject_status: SubjectStatus!
    created_by: ID
    created_at: Date
    updated_by: ID
    updated_at: Date
    deleted_by: ID
    deleted_at: Date
  }

  input CreateSubjectInput {
    block_id: ID
    name: String!
    description: String!
    coefficient: Float!
    subject_code: String!
    subject_status: SubjectStatus!
  }

  input UpdateSubjectInput {
    block_id: ID
    name: String!
    description: String!
    coefficient: Float!
    subject_code: String!
    subject_status: SubjectStatus!
  }

  type Query {
    GetAllSubjects: [Subject!]!
    GetOneSubject(_id: ID!): Subject
  }

  type Mutation {
    CreateSubject(created_by: ID!, input: CreateSubjectInput!): Subject!
    UpdateSubject(_id: ID!, updated_by: ID!, input: UpdateSubjectInput!): Subject!
    DeleteSubject(_id: ID!): ID!
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
