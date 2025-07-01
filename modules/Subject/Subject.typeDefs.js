const { gql } = require('apollo-server-express');

const typeDefs = gql`
scalar Date

enum SubjectStatus {
  ACTIVE
  COMPLETED
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
    id: ID!
    block_id: Block
    name: String!
    description: String!
    coefficient: Float!
    test_ids: [Test]
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
}

input UpdateSubjectInput {
  name: String!
  description: String!
  coefficient: Float!
  subject_code: String!
  subject_status: SubjectStatus!
}

type Query {
  GetAllSubjects: [Subject!]!
  GetOneSubject(id: ID!): Subject
}

type Mutation {
  CreateSubject(input: CreateSubjectInput!): Subject!
  UpdateSubject(id: ID!, input: UpdateSubjectInput!): Subject!
  DeleteSubject(id: ID!): Subject!
}
`;

module.exports = typeDefs;
