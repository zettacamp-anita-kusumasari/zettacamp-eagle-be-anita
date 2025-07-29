// *************** IMPORT LIBRARY ***************
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
  
  
  type Address {
    street_name: String!
    city: String!
    country: String!
    zip_code: String!
  }
  
  type Student {
    _id: ID!
    first_name: String!
    last_name: String!
    e_mail: String!
    student_birth: StudentBirth!
    student_status: StudentStatus!
    address: Address    
    school: School
    school_id: School
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

  input AddressInput {
    street_name: String!
    city: String!
    country: String!
    zip_code: String!
  }

  input CreateStudentInput {
    school_id: ID
    first_name: String!
    last_name: String!
    e_mail: String!
    student_birth: StudentBirthInput!
    student_status: StudentStatus!
    address: AddressInput
  }

  input UpdateStudentInput {
    school_id: ID
    first_name: String!
    last_name: String!
    e_mail: String!
    student_birth: StudentBirthInput!
    student_status: StudentStatus!
    address: AddressInput
  }

  type Query {
    GetAllStudents: [Student!]!
    GetOneStudent(_id: ID!): Student
  }

  type Mutation {
    CreateStudent(input: CreateStudentInput): Student
    UpdateStudent(_id: ID!, input: UpdateStudentInput): Student
    DeleteStudent(_id: ID!): Student
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;