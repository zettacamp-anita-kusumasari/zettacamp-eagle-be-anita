// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type Student {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    dateOfBirth: Date!
    school: School
    schoolId: ID
    created_by: User
    deleted_by: User
    created_at: Date
    updated_at: Date
  }

  input CreateStudentInput {
    firstName: String!
    lastName: String!
    email: String!
    dateOfBirth: Date!
    schoolId: ID
  }

  input UpdateStudentInput {
    firstName: String
    lastName: String
    email: String
    dateOfBirth: Date
    schoolId: ID
  }

  type Query {
    GetAllStudents: [Student]
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