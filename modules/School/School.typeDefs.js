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
 * @property {String!} name - Official name of the school.
 * @property {String!} initial_name - Short or initial name of the school.
 * @property {String} address - Address of the school (optional).
 * @property {String!} city - City where the school is located.
 * @property {String!} country - Country where the school is located.
 * @property {String!} postal_code - Postal/ZIP code of the school.
 * @property {[Student]} students - List of students attending the school.
 * @property {[User]} createdBy - Users who created the school.
 * @property {[User]} deletedBy - Users who deleted the school.
 *
 * Inputs:
 * @input Mutation_CreateSchool - Input type for creating a school.
 *   @field {String!} name
 *   @field {String!} initial_name
 *   @field {String} address
 *   @field {String!} city
 *   @field {String!} country
 *   @field {String!} postal_code
 *
 * @input Mutation_UpdateSchool - Input type for updating a school.
 *   @field {String} name
 *   @field {String} initial_name
 *   @field {String} address
 *   @field {String} city
 *   @field {String} country
 *   @field {String} postal_code
 *
 * Queries:
 * @query GetAllSchools - Retrieve all schools.
 * @query GetOneSchool(id: ID!) - Retrieve a school by its ID.
 *
 * Mutations:
 * @mutation createSchool - Create a new school.
 *   @param {Mutation_CreateSchool} input - School creation fields.
 *   @returns {School}
 *
 * @mutation updateSchool - Update an existing school.
 *   @param {ID!} id - ID of the school to update.
 *   @param {Mutation_UpdateSchool} input - Fields to update.
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
    initial_name: String!
    address: String
    city: String!
    country: String!
    postal_code: String!
    students: [Student]
    createdBy: [User]
    deletedBy: [User]
  }

  input Mutation_CreateSchool {
    name: String!
    initial_name: String!
    address: String
    city: String!
    country: String!
    postal_code: String!
  }

  input Mutation_UpdateSchool {
    name: String
    initial_name: String
    address: String
    city: String
    country: String
    postal_code: String
  }

  type Query {
    GetAllSchools: [School]
    GetOneSchool(id: ID!): School
  }

  type Mutation {
    createSchool(input: Mutation_CreateSchool): School
    updateSchool(id: ID!, input: Mutation_UpdateSchool): School
    deleteSchool(id: ID!): School
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;