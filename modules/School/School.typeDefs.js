// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date
  
  type School {
  id: ID!
  name: String!
  initial_name: String!
  address: String!
  city: String!
  country: String!
  postal_code: String!
  students: Student
  createdBy: User
  deletedBy: User
  createdAt: String
  updatedAt: String
}

type Query {
  getAllSchools: [School!]!
  getOneSchool(id: ID!): School
}

input SchoolInput {
  name: String!
  initial_name: String!
  address: String!
  city: String!
  country: String!
  postal_code: String!
}

type Mutation {
  createSchool(input: SchoolInput!): School
  updateSchool(id: ID!, input: SchoolInput!): School
  deleteSchool(id: ID!): School
}
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;