// *************** IMPORT LIBRARY ***************
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  enum BlockStatus {
    ACTIVE
    DELETED
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

  type Block {
    _id: ID!
    name: String!
    description: String!
    subject_ids: [Subject]
    school_id: School
    user_id: ID
    academic_year: Int!
    block_code: String!
    block_status: BlockStatus!
    block_type: BlockType!
    evaluation_assessment: EvaluationAssessment!
    created_by: ID
    created_at: Date
    updated_by: ID
    updated_at: Date
    deleted_by: ID
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
    user_id: ID
  }

  input UpdateBlockInput {
    name: String!
    description: String!
    academic_year: Int!
    block_code: String!
    block_status: BlockStatus!
    block_type: BlockType!
    evaluation_assessment: EvaluationAssessment!
    user_id: ID
  }

  type Query {
    GetAllBlocks: [Block!]!
    GetOneBlock(_id: ID!): Block
  }

  type Mutation {
    CreateBlock(input: CreateBlockInput!): Block!
    UpdateBlock(_id: ID!, input: UpdateBlockInput!): Block!
    DeleteBlock(_id: ID!): ID!
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
