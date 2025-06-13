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
    createdBy: User
    deletedBy: User
    createdAt: Date
    updatedAt: Date
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
    getAllStudents: [Student]
    getOneStudent(id: ID!): Student
  }

  type Mutation {
    createStudent(input: CreateStudentInput): Student
    updateStudent(id: ID!, input: UpdateStudentInput): Student
    deleteStudent(id: ID!): Student
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;