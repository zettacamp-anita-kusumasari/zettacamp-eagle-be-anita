// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Validator = require("validator");

/**
 * Validates the input object for creating or updating a StudentTestResult.
 *
 * This function checks:
 * - That `marks` is a non-empty array.
 * - Each item in `marks` has a valid `notation_text` and a numeric `mark`.
 * - If provided, `average_mark` must be a valid number.
 *
 * @function ValidateStudentTestResultInput
 * @param {Object} input - The input object to validate.
 * @param {Array<Object>} input.marks - An array of mark objects.
 * @param {string} input.marks[].notation_text - The name of the notation category.
 * @param {number|string} input.marks[].mark - The numeric mark (can be string or number).
 * @param {number|string} [input.average_mark] - Optional average mark to validate.
 * @throws {ApolloError} Throws an ApolloError if validation fails.
 */
function ValidateStudentTestResultInput(input) {
  // *************** Destructure expected fields from the input object
  const { marks, average_mark } = input;
  // *************** Validate marks: must be an array and not empty
  if (!Array.isArray(marks) || marks.length === 0) {
    throw new ApolloError(
      "Marks is required and must be a non-empty array.",
      "BAD_USER_INPUT",
      { field: "marks" }
    );
  }
  // *************** Validate each mark item
  marks.forEach(function (mark, index) {
    // *************** Validate that notation_text is provided and not an empty string
    if (!mark.notation_text || Validator.isEmpty(mark.notation_text)) {
      throw new ApolloError(
        `Notation Text at index ${index} is required.`,
        "BAD_USER_INPUT",
        { field: `marks[${index}].notation_text` }
      );
    }
    // *************** Validate that mark is provided and float
    if (mark.mark === undefined || !Number.isFinite(Number(mark.mark))) {
      throw new ApolloError(
        `Mark at index ${index} must be a valid number.`,
        "BAD_USER_INPUT",
        { field: `marks[${index}].mark` }
      );
    }
  });
  // *************** Validate that weight is a valid float
  if (average_mark && !Number.isFinite(Number(average_mark))) {
    throw new ApolloError(
      "Average Mark must be a valid float.",
      "BAD_USER_INPUT",
      { field: "average_mark" }
    );
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  ValidateStudentTestResultInput,
};
