// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Validator = require("validator");
const Mongoose = require("mongoose");

// *************** Valid Enum for the Block.validator
const ValidStatus = ["ACTIVE", "DELETED"];
const ValidType = ["REGULER", "PROFESSIONAL", "SOFT_SKILL", "RETAKE"];
const ValidAssessment = ["COMPETENCY", "SCORE"];

/**
 * Validates the input data for creating or updating a block.
 *
 * @param {Object} input - The input object containing block data.
 * @param {string} input.name - The name of the block (required).
 * @param {string} input.description - The description of the block (required).
 * @param {number|string} input.academic_year - The academic year (should be an integer).
 * @param {string} input.block_code - The code for the block (required).
 * @param {string} input.block_status - The status of the block, must be one of 'ACTIVE' or 'DELETED'.
 * @param {string} input.block_type - The type of the block, must be one of 'REGULER', 'PROFESSIONAL', 'SOFT_SKILL', or 'RETAKE'.
 * @param {string} input.evaluation_assessment - The assessment method, must be one of 'COMPETENCY' or 'SCORE'.
 * @param {string} input.user_id - The ID of the user performing the action (required).
 *
 * @throws {ApolloError} If any validation rule is violated.
 */
function ValidateBlockInput(input) {
  // *************** Destructure expected fields from the input object
  const {
    name,
    description,
    academic_year,
    block_code,
    block_status,
    block_type,
    evaluation_assessment,
    user_id,
  } = input;
  // *************** Validate that name is provided and not an empty string
  if (!name || Validator.isEmpty(name)) {
    throw new ApolloError("Name is required.", "BAD_USER_INPUT", {
      field: "name",
    });
  }
  // *************** Validate that description is provided and not an empty string
  if (!description || Validator.isEmpty(description)) {
    throw new ApolloError("Description is required.", "BAD_USER_INPUT", {
      field: "description",
    });
  }
  // *************** Validate that academic_year is a valid integer
  if (academic_year && !Number.isInteger(Number(academic_year))) {
    throw new ApolloError(
      "Academic year must be a valid integer.",
      "BAD_USER_INPUT",
      { field: "academic_year" }
    );
  }
  // *************** Validate that block code is provided and not an empty string
  if (!block_code || Validator.isEmpty(block_code)) {
    throw new ApolloError("Block code is required.", "BAD_USER_INPUT", {
      field: "block_code",
    });
  }
  // *************** Validate that block status exists and is within the allowed values (‘ACTIVE’ | ‘DELETED’)
  if (!block_status || !ValidStatus.includes(block_status.toUpperCase())) {
    throw new ApolloError(
      `Block status must be one of: ${ValidStatus.join(", ")}.`,
      "BAD_USER_INPUT",
      { field: "block_status" }
    );
  }
  // *************** Validate that block type exists and is within the allowed values (‘REGULER’ | ‘PROFESSIONAL’ | ‘SOFT_SKILL’ | ‘RETAKE’)
  if (!block_type || !ValidType.includes(block_type.toUpperCase())) {
    throw new ApolloError(
      `Block type status must be one of: ${ValidType.join(", ")}.`,
      "BAD_USER_INPUT",
      { field: "school_type" }
    );
  }
  // *************** Validate that user_id is a Valid ObjectId Mongoose
  if (!Mongoose.Types.ObjectId.isValid(user_id)) {
    throw new ApolloError(`Invalid ID: ${user_id}`, "BAD_USER_INPUT");
  }
  // *************** Validate evaluation_assessment is it Upper Case
  const assessment = evaluation_assessment?.toUpperCase();
  // *************** Validate evaluation_assessment is it according to ValidAssessment enum
  if (!assessment || !ValidAssessment.includes(assessment)) {
    throw new ApolloError(
      `Evaluation assessment must be one of: ${ValidAssessment.join(", ")}.`,
      "BAD_USER_INPUT",
      { field: "evaluation_assessment" }
    );
  }
  // *************** Cross-field validation: evaluation_assessment (COMPETENCY) vs block_type
  if (
    assessment === "COMPETENCY" &&
    !["PROFESSIONAL", "SOFT_SKILL"].includes(block_type)
  ) {
    throw new ApolloError(
      "For COMPETENCY assessment, block type must be PROFESSIONAL or SOFT_SKILL.",
      "BAD_USER_INPUT",
      { field: "block_type" }
    );
  }
  // *************** Cross-field validation: evaluation_assessment (SCORE) vs block_type
  if (assessment === "SCORE" && !["REGULER", "RETAKE"].includes(block_type)) {
    throw new ApolloError(
      "For SCORE assessment, block type must be REGULER or RETAKE.",
      "BAD_USER_INPUT",
      { field: "block_type" }
    );
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  ValidateBlockInput,
};
