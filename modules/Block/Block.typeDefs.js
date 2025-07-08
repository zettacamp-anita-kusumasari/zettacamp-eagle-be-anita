// *************** IMPORT LIBRARY ***************
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  enum BlockStatus {
    ACTIVE
    COMPLETED
  }

  enum BlockType {
    REGULER
    PROFESSIONAL
    SOFT_SKILL
    RETAKE
  }

  enum EvaluationAssessment {
    COMPETENCY
    SCORE
  }

  type Subject {
    id: ID!
    name: String!
    description: String
    coefficient: Float!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Block {
    id: ID!
    name: String!
    description: String!
    subject_ids: [Subject]
    school_id: ID
    user_id: ID!
    academic_year: Int!
    block_code: String!
    block_status: BlockStatus!
    block_type: BlockType!
    evaluation_assessment: EvaluationAssessment!
    created_by: User
    created_at: Date
    updated_by: User
    updated_at: Date
    deleted_by: User
    deleted_at: Date
  }

  input CreateBlockInput {
    name: String!
    description: String!
    academic_year: Int!
    block_code: String!
    block_status: BlockStatus!
    block_type: BlockType!
    evaluation_assessment: EvaluationAssessment!
    user_id: ID!
  }

  input UpdateBlockInput {
    name: String!
    description: String!
    academic_year: Int!
    block_code: String!
    block_status: BlockStatus!
    block_type: BlockType!
    evaluation_assessment: EvaluationAssessment!
    user_id: ID!
  }

  type Query {
    GetAllBlocks: [Block!]!
    GetOneBlock(id: ID!): Block
  }

  type Mutation {
    CreateBlock(input: CreateBlockInput!): Block!
    UpdateBlock(id: ID!, input: UpdateBlockInput!): Block!
    DeleteBlock(id: ID!, user_id: ID!): Block!
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
