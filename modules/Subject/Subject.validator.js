// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Validator = require("validator");
const Mongoose = require("mongoose");

// *************** GLOBAL VARIABLE ***************
const ValidStatus = ["ACTIVE", "DELETED"];

/**
 * Validates the input object for subject creation or update.
 *
 * @param {Object} input - The input data for subject.
 * @param {string} input.name - Name of the subject.
 * @param {string} input.description - Description of the subject.
 * @param {string|number} input.coefficient - Coefficient used for weighting.
 * @param {string} input.subject_code - Unique code for the subject.
 * @param {string} input.subject_status - Status of the subject ('ACTIVE' or 'DELETED').
 * @param {string} input.user_id - ID of the user performing the action.
 * @throws {ApolloError} - If any field is invalid or missing.
 */
function ValidateSubjectInput(input) {
  // *************** Destructure expected fields from the input object
  const {
    name,
    block_id,
    description,
    coefficient,
    subject_code,
    subject_status,
    user_id,
  } = input;
  // *************** Validate that name is provided and not an empty string
  if (!name || Validator.isEmpty(name)) {
    throw new ApolloError("Name is required.", "BAD_USER_INPUT", {
      field: "name",
    });
  }
  // *************** Validate that block_id is a Valid ObjectId Mongoose
  if (!block_id || !Mongoose.Types.ObjectId.isValid(block_id)) {
    throw new ApolloError(`Invalid ID: ${block_id}`, "BAD_USER_INPUT");
  }

  // *************** Validate that description is provided and not an empty string
  if (!description || Validator.isEmpty(description)) {
    throw new ApolloError("Description is required.", "BAD_USER_INPUT", {
      field: "description",
    });
  }
  // *************** Validate that coefficient is a valid float
  if (coefficient && !Number.isFinite(Number(coefficient))) {
    throw new ApolloError(
      "Coefficient must be a valid float.",
      "BAD_USER_INPUT",
      { field: "coefficient" }
    );
  }
  // *************** Validate that subject code is provided and not an empty string
  if (!subject_code || Validator.isEmpty(subject_code)) {
    throw new ApolloError("Subject code is required.", "BAD_USER_INPUT", {
      field: "subject_code",
    });
  }
  // *************** Validate that subject status exists and is within the allowed values (‘ACTIVE’ | ‘DELETED’)
  if (!subject_status || !ValidStatus.includes(subject_status.toUpperCase())) {
    throw new ApolloError(
      `Subject status must be one of: ${ValidStatus.join(", ")}.`,
      "BAD_USER_INPUT",
      { field: "subject_status" }
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
  ValidateSubjectInput,
};
