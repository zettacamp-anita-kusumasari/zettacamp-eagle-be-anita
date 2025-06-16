// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type Student {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    date_of_birth: Date!
    school: School
    school_id: ID
    created_by: User
    deleted_by: User
    created_at: Date
    updated_at: Date
  }

  input CreateStudentInput {
    first_name: String!
    last_name: String!
    email: String!
    date_of_birth: Date!
    school_id: ID
  }

  input UpdateStudentInput {
    first_name: String
    last_name: String
    email: String
    date_of_birth: Date
    school_id: ID
  }

  type Query {
    GetAllStudents: [Student!]!
    GetOneStudent(id: ID!): Student
  }

  type Mutation {
    CreateStudent(input: CreateStudentInput): Student
    UpdateStudent(id: ID!, input: UpdateStudentInput): Student
    DeleteStudent(id: ID!): Student
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;