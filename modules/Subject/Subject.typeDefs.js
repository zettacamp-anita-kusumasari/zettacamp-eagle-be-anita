// *************** IMPORT LIBRARY ***************
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  enum SubjectStatus {
    ACTIVE
    DELETED
  }

  type Block {
    id: ID!
    name: String!
    description: String
    academic_year: Int
  }

  type Test {
    id: ID!
    title: String!
    date: Date
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Subject {
    _id: ID!
    block_id: Block
    name: String!
    description: String!
    coefficient: Float!
    test_ids: [Test]
    user_id: ID
    subject_code: String!
    subject_status: SubjectStatus!
    created_by: User
    created_at: Date
    updated_by: User
    updated_at: Date
    deleted_by: User
    deleted_at: Date
  }

  input CreateSubjectInput {
    name: String!
    description: String!
    coefficient: Float!
    subject_code: String!
    subject_status: SubjectStatus!
    user_id: ID
  }

  input UpdateSubjectInput {
    name: String!
    description: String!
    coefficient: Float!
    subject_code: String!
    subject_status: SubjectStatus!
    user_id: ID
  }

  type Query {
    GetAllSubjects: [Subject!]!
    GetOneSubject(id: ID!): Subject
    GetStudentWeightedAverage(subject_id: ID!, student_id: ID!): Float!
  }

  type Mutation {
    CreateSubject(input: CreateSubjectInput!): Subject!
    UpdateSubject(id: ID!, input: UpdateSubjectInput!): Subject!
    DeleteSubject(_id: ID!, user_id: ID): ID!
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
