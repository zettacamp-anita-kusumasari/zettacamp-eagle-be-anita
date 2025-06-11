// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

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

  input CreateSchoolInput {
    name: String!
    initial_name: String!
    address: String
    city: String!
    country: String!
    postal_code: String!
  }

  input UpdateSchoolInput {
    name: String
    initial_name: String
    address: String
    city: String
    country: String
    postal_code: String
  }

  type Query {
    getAllSchools: [School]
    getOneSchool(id: ID!): School
  }

  type Mutation {
    createSchool(input: CreateSchoolInput): School
    updateSchool(id: ID!, input: UpdateSchoolInput): School
    deleteSchool(id: ID!): School
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;