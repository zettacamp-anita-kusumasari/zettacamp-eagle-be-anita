// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Validator = require("validator");
const Mongoose = require("mongoose");

// *************** Valid status for test_status
const ValidStatus = ["NOT_PUBLISHED", "PUBLISHED", "DELETED"];

/**
 * Validates the input object for creating or updating a Test entity.
 *
 * This function checks required fields such as `name`, `description`, `weight`, `notations`,
 * `test_status`, `for_retake`, `published_date`, and `user_id`. It throws an ApolloError
 * if any validation fails, providing appropriate error messages and field references.
 *
 * @param {Object} input - The input object containing fields to validate.
 * @param {string} input.name - The name of the test (required, non-empty string).
 * @param {string} input.description - The description of the test (required, non-empty string).
 * @param {number|string} [input.weight] - The weight of the test (optional, must be a valid float if provided).
 * @param {Array<Object>} input.notations - An array of notation objects (required, non-empty array).
 * @param {string} input.notations[].notation_text - Text description of the notation (required, non-empty string).
 * @param {number|string} input.notations[].max_point - Maximum point value (required, must be non-negative number).
 * @param {string} input.test_status - The status of the test ('PUBLISHED' or 'NOT_PUBLISHED', required).
 * @param {boolean} input.for_retake - Indicates if the test is for retake (required, must be boolean).
 * @param {string|Date} input.published_date - The published date of the test (required, must be a valid date).
 * @param {string} input.user_id - ID of the user creating or updating the test (required, non-empty string).
 *
 * @throws {ApolloError} - Throws error if any field fails validation, with code 'BAD_USER_INPUT' and field metadata.
 */
function ValidateTestInput(input) {
  // *************** Destructure expected fields from the input object
  const {
    name,
    subject_id,
    description,
    weight,
    notations,
    test_status,
    for_retake,
    published_date,
    user_id,
  } = input;
  // *************** Validate that name is provided and not an empty string
  if (!name || Validator.isEmpty(name)) {
    throw new ApolloError("Name is required.", "BAD_USER_INPUT", {
      field: "name",
    });
  }
  // *************** Validate that subject_id is a valid MongoDB ObjectId
  if (!Mongoose.Types.ObjectId.isValid(subject_id)) {
    throw new ApolloError(
      `Invalid subject_id: ${subject_id}`,
      "BAD_USER_INPUT",
      {
        field: "subject_id",
      }
    );
  }
  // *************** Validate that description is provided and not an empty string
  if (!description || Validator.isEmpty(description)) {
    throw new ApolloError("Description is required.", "BAD_USER_INPUT", {
      field: "description",
    });
  }
  // *************** Validate that weight is a valid float
  if (weight && !Number.isFinite(Number(weight))) {
    throw new ApolloError("Weight must be a valid float.", "BAD_USER_INPUT", {
      field: "weight",
    });
  }
  // *************** Validate notations: must be an array and not empty
  if (!Array.isArray(notations) || notations.length === 0) {
    throw new ApolloError(
      "Notations is required and must be a non-empty array.",
      "BAD_USER_INPUT",
      { field: "notations" }
    );
  }
  // *************** Validate each notation item
  notations.forEach(function (notation, index) {
    // *************** Validate that notation_text is provided and not an empty string
    if (!notation.notation_text || Validator.isEmpty(notation.notation_text)) {
      throw new ApolloError(
        `Notation Text at index ${index} is required.`,
        "BAD_USER_INPUT",
        { field: `notations[${index}].notation_text` }
      );
    }
    // *************** Validate that max_point is provided and float
    if (
      notation.max_point === undefined ||
      !Number.isFinite(Number(notation.max_point))
    ) {
      throw new ApolloError(
        `Max Point at index ${index} must be a valid number.`,
        "BAD_USER_INPUT",
        { field: `notations[${index}].max_point` }
      );
    }
    // *************** Validate that max_point is not negative
    if (Number(notation.max_point) < 0) {
      throw new ApolloError(
        `Max Point at index ${index} cannot be negative.`,
        "BAD_USER_INPUT",
        { field: `notations[${index}].max_point` }
      );
    }
  });
  // *************** Validate that test status exists and is within the allowed values ('PUBLISHED', 'NOT_PUBLISHED')
  if (!test_status || !ValidStatus.includes(test_status.toUpperCase())) {
    throw new ApolloError(
      `Test status must be one of: ${ValidStatus.join(", ")}.`,
      "BAD_USER_INPUT",
      { field: "test_status" }
    );
  }
  // *************** Validate that for_retake must be a boolean (true or false)
  if (typeof for_retake !== "boolean") {
    throw new ApolloError(
      "For Retake must be a boolean value.",
      "BAD_USER_INPUT",
      { field: "for_retake" }
    );
  }
  // *************** Validate that published_date is provided
  if (!published_date || isNaN(new Date(published_date).getTime())) {
    throw new ApolloError(
      "Published Date is required and must be a valid date.",
      "BAD_USER_INPUT",
      { field: "published_date" }
    );
  }
  // *************** Validate that user_id is a valid MongoDB ObjectId
  if (!Mongoose.Types.ObjectId.isValid(user_id)) {
    throw new ApolloError(`Invalid user_id: ${user_id}`, "BAD_USER_INPUT", {
      field: "user_id",
    });
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  ValidateTestInput,
};
