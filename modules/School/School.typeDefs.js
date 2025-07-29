// *************** IMPORT LIBRARY ***************
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type Address {
    street_name: String!
    city: String!
    country: String!
    zip_code: String!
  }

  enum SchoolStatus {
    ACTIVE
    INACTIVE
  }

  type School {
    _id: ID!
    legal_name: String!
    commercial_name: String!
    logo: String
    address: Address!
    school_status: SchoolStatus!
    student_ids: [Student]
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
    GetOneSchool(_id: ID!): School
  }

  type Mutation {
    CreateSchool(input: CreateSchoolInput!): School!
    UpdateSchool(_id: ID!, input: UpdateSchoolInput!): School!
    DeleteSchool(_id: ID!): School!
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
