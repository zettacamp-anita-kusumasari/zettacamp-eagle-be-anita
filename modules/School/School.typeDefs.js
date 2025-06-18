// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
scalar Date

type Address {
  street_name: String!
  city: String!
  country: String!
  zip_code: String!
}

enum SchoolStatus {
  PENDING
  ACTIVE
  DELETED
}

type School {
  id: ID!
  legal_name: String!
  commercial_name: String!
  logo: String
  address: Address!
  school_status: SchoolStatus!
  students: [Student]
  created_by: User
  created_at: Date
  updated_by: User
  updated_at: Date
  deleted_by: User
  deleted_at: Date
}

input AddressInput {
  street_name: String!
  city: String!
  country: String!
  zip_code: String!
}

input CreateSchoolInput {
  legal_name: String!
  commercial_name: String!
  logo: String
  address: AddressInput!
  school_status: SchoolStatus!
}

input UpdateSchoolInput {
  legal_name: String!
  commercial_name: String!
  logo: String
  address: AddressInput!
  school_status: SchoolStatus!
}

type Query {
  GetAllSchools: [School!]!
  GetOneSchool(id: ID!): School
}

type Mutation {
  CreateSchool(input: CreateSchoolInput!): School!
  UpdateSchool(id: ID!, input: UpdateSchoolInput!): School!
  DeleteSchool(id: ID!): School!
}
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;