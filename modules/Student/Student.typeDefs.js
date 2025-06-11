// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

/**
 * GraphQL Schema Definitions using gql template literal.
 *
 * Scalars:
 * @scalar Date - Custom scalar type to represent date values.
 *
 * @type Student
 * @property {ID!} id - Unique identifier for the student.
 * @property {String!} firstName - First name of the student.
 * @property {String!} lastName - Last name of the student.
 * @property {String!} email - Email address of the student.
 * @property {Date!} dateOfBirth - Date of birth of the student.
 * @property {[School]} school - Schools the student is enrolled in.
 * @property {ID} schoolId - Identifier of the related school (optional).
 * @property {[User]} createdBy - Users who created the student record.
 * @property {[User]} deletedBy - Users who deleted the student record.
 *
 * Inputs:
 * @input Mutation_CreateStudent - Input type for creating a student.
 *   @field {String!} firstName
 *   @field {String!} lastName
 *   @field {String!} email
 *   @field {Date!} dateOfBirth
 *
 * @input Mutation_UpdateStudent - Input type for updating a student.
 *   @field {String} firstName
 *   @field {String} lastName
 *   @field {String} email
 *   @field {Date} dateOfBirth
 *
 * Queries:
 * @query GetAllStudents - Retrieve all students.
 * @query GetOneStudent(id: ID!) - Retrieve a student by ID.
 *
 * Mutations:
 * @mutation createStudent - Create a new student.
 *   @param {Mutation_CreateStudent} input - Student creation fields.
 *   @returns {Student}
 *
 * @mutation updateStudent - Update an existing student.
 *   @param {ID!} id - ID of the student to update.
 *   @param {Mutation_UpdateStudent} input - Fields to update.
 *   @returns {Student}
 *
 * @mutation deleteStudent - Delete a student by ID.
 *   @param {ID!} id - ID of the student to delete.
 *   @returns {Student}
 */
const typeDefs = gql`
  scalar Date

  type Student {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    dateOfBirth: Date!
    school: [School]
    schoolId: ID
    createdBy: [User]
    deletedBy: [User] 
  }

  input Mutation_CreateStudent {
    firstName: String!
    lastName: String!
    email: String!
    dateOfBirth: Date!
  }

  input Mutation_UpdateStudent {
    firstName: String
    lastName: String
    email: String
    dateOfBirth: Date
  }

  type Query {
    GetAllStudents: [Student]
    GetOneStudent(id: ID!): Student
  }

  type Mutation {
    createStudent(input: Mutation_CreateStudent): Student
    updateStudent(id: ID!, input: Mutation_UpdateStudent): Student
    deleteStudent(id: ID!): Student
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;