// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

/**
 * GraphQL Schema Definitions using gql template literal.
 *
 * Scalars:
 * @scalar Date - Custom scalar type to represent date values.
 *
 * @type School
 * @property {ID!} id - Unique identifier for the school.
 * @property {String!} name - Name of the school.
 * @property {String} address - Address of the school (optional).
 * @property {[Student]} students - List of students attending the school.
 *
 * Queries:
 * @query schools - Retrieve all schools.
 * @query school(id: ID!) - Retrieve a school by ID.
 *
 * Mutations:
 * @mutation createSchool - Create a new school.
 *   @param {String!} name - Name of the school.
 *   @param {String} address - Address of the school (optional).
 *   @returns {School}
 *
 * @mutation updateSchool - Update an existing school by ID.
 *   @param {ID!} id - ID of the school to update.
 *   @param {String} name - New name (optional).
 *   @param {String} address - New address (optional).
 *   @returns {School}
 *
 * @mutation deleteSchool - Delete a school by ID.
 *   @param {ID!} id - ID of the school to delete.
 *   @returns {School}
 */
const typeDefs = gql`
  scalar Date
  
  type School {
    id: ID!
    name: String!
    address: String
    students: Student
  }

  type Query {
    schools: [School]
    school(id: ID!): School
  }

  type Mutation {
    createSchool(name: String!, address: String!): School
    updateSchool(id: ID!, name: String, address: String): School
    deleteSchool(id: ID!): School
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;