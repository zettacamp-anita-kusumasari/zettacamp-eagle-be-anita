// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

/**
 * GraphQL Schema Definitions using gql template literal.
 *
 * Scalars:
 * @scalar Date - Custom scalar type to represent date values.
 *
 * Types:
 * @type Student
 * @property {ID!} id - Unique identifier for the student.
 * @property {String!} firstName - First name of the student.
 * @property {String!} lastName - Last name of the student.
 * @property {String!} email - Email address of the student.
 * @property {Date} dateOfBirth - Birth date of the student.
 * @property {School} school - Associated school object.
 * @property {ID!} schoolId - ID of the associated school.
 * @property {Date} deletedAt - Timestamp for soft delete (null if not deleted).
 *
 * Queries:
 * @query students - Retrieve all students.
 * @query student(id: ID!) - Retrieve a student by ID.
 *
 * Mutations:
 * @mutation createStudent - Create a new student.
 *   @param {String!} firstName - First name of the student.
 *   @param {String!} lastName - Last name of the student.
 *   @param {String!} email - Email address of the student.
 *   @param {Date} dateOfBirth - Date of birth of the student.
 *   @param {ID!} schoolId - ID of the school the student belongs to.
 *   @returns {Student}
 *
 * @mutation updateStudent - Update an existing student by ID.
 *   @param {ID!} id - ID of the student to update.
 *   @param {String} firstName - New first name (optional).
 *   @param {String} lastName - New last name (optional).
 *   @param {String} email - New email (optional).
 *   @param {Date} dateOfBirth - New date of birth (optional).
 *   @param {ID} schoolId - New school ID (optional).
 *   @returns {Student}
 *
 * @mutation deleteStudent - Soft delete a student by ID.
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
    dateOfBirth: Date
    school: School
    schoolId: ID!
    deletedAt: Date
  }

  type Query {
    students: [Student]
    student(id: ID!): Student
  }

  type Mutation {
    createStudent(firstName: String!, lastName: String!, email: String!, dateOfBirth: Date, password: String!, schoolId: ID!): Student
    updateStudent(id: ID!, firstName: String, lastName: String, email: String, dateOfBirth: Date, schoolId: ID): Student
    deleteStudent(id: ID!): Student
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;