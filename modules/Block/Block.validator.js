// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Validator = require("validator");

// *************** Valid status for block_status
const ValidStatus = ["ACTIVE", "DELETED"];

// *************** Valid type for block_type
const ValidType = ["REGULER", "PROFESSIONAL", "SOFT_SKILL", "RETAKE"];

// *************** Valid assessment for evaluation_assessment
const ValidAssessment = ["COMPETENCY", "SCORE"];

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
  // *************** Validate evaluation_assessment
  const assessment = evaluation_assessment?.toUpperCase();
  if (!assessment || !ValidAssessment.includes(assessment)) {
    throw new ApolloError(
      `Evaluation assessment must be one of: ${ValidAssessment.join(", ")}.`,
      "BAD_USER_INPUT",
      { field: "evaluation_assessment" }
    );
  }
  // *************** Cross-field validation: evaluation_assessment vs block_type
  if (
    assessment === "COMPETENCY" &&
    !["PROFESSIONAL", "SOFT_SKILL"].includes(type)
  ) {
    throw new ApolloError(
      "For COMPETENCY assessment, block type must be PROFESSIONAL or SOFT_SKILL.",
      "BAD_USER_INPUT",
      { field: "block_type" }
    );
  }
  if (assessment === "SCORE" && !["REGULER", "RETAKE"].includes(type)) {
    throw new ApolloError(
      "For SCORE assessment, block type must be REGULER or RETAKE.",
      "BAD_USER_INPUT",
      { field: "block_type" }
    );
  }
  // *************** Validate that user_id is provided and not an empty string
  if (!user_id || Validator.isEmpty(user_id)) {
    throw new ApolloError("User id is required.", "BAD_USER_INPUT", {
      field: "user_id",
    });
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  ValidateBlockInput,
};
