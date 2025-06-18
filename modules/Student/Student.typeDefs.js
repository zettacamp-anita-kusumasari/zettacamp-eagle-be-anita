// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type StudentBirth {
    date_of_birth: Date!
    place_of_birth: String!
  }

  enum StudentStatus {
    ACTIVE
    INACTIVE
  }
  
  type Contact {
    phone_number: String!
    email: String!
  }
  
  type Address {
    street_name: String!
    city: String!
    country: String!
    zip_code: String!
  }
  
  type Student {
    id: ID!
    first_name: String!
    last_name: String!
    photo_profile: String
    student_birth: StudentBirth!
    student_status: StudentStatus!
    contact: Contact!
    address: Address    
    school: School
    school_id: ID
    created_by: User
    updated_by: User
    deleted_by: User
    created_at: Date
    updated_at: Date
    deleted_at: Date
  }

  input StudentBirthInput {
    date_of_birth: Date!
    place_of_birth: String!
  }

  input ContactInput {
    phone_number: String!
    email: String!
  }

  input AddressInput {
    street_name: String!
    city: String!
    country: String!
    zip_code: String!
  }

  input CreateStudentInput {
    first_name: String!
    last_name: String!
    photo_profile: String
    student_birth: StudentBirthInput!
    student_status: StudentStatus!
    contact: ContactInput!
    address: AddressInput
  }

  input UpdateStudentInput {
    first_name: String!
    last_name: String!
    photo_profile: String
    student_birth: StudentBirthInput!
    student_status: StudentStatus!
    contact: ContactInput!
    address: AddressInput
  }

  type Query {
    GetAllStudents: [Student!]!
    GetOneStudent(id: ID!): Student
  }

  type Mutation {
    CreateStudent(input: CreateStudentInput): Student
    UpdateStudent(id: ID!, input: UpdateStudentInput): Student
    DeleteStudent(id: ID!): Student
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;