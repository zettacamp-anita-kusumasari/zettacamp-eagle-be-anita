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
  students: [Student]
  created_by: User
  deleted_by: User
  created_at: String
  updated_at: String
}

input CreateSchoolInput {
  name: String!
  initial_name: String!
  address: String!
  city: String!
  country: String!
  postal_code: String!
}

input UpdateSchoolInput {
  name: String!
  initial_name: String!
  address: String!
  city: String!
  country: String!
  postal_code: String!
}

type Query {
  GetAllSchools: [School!]!
  GetOneSchool(id: ID!): School
}

type Mutation {
  CreateSchool(input: CreateSchoolInput!): School
  UpdateSchool(id: ID!, input: UpdateSchoolInput!): School
  DeleteSchool(id: ID!): School
}
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;