// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Mongoose = require("mongoose");

// *************** IMPORT MODULE ***************
const StudentTestResultModel = require("./StudentTestResult.model");

// *************** IMPORT VALIDATOR ***************
const {
  ValidateStudentTestResultInput,
} = require("./StudentTestResult.validator");

// *************** QUERY ***************
/**
 * Get all student test results from the database.
 *
 * @async
 * @function GetAllStudentTestResults
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of student test result objects.
 * @throws {ApolloError} Throws an ApolloError if fetching fails.
 */
async function GetAllStudentTestResults() {
  try {
    // *************** Try to fetch all Student Test Result
    const results = await StudentTestResultModel.find().lean();
    // *************** Return to result
    return results;
  } catch (error) {
    // *************** If an error occur, throw apollo error
    throw new ApolloError(error.message);
  }
}

/**
 * Retrieves a single student test result by its ID.
 *
 * @param {any} _ - Unused GraphQL resolver root argument.
 * @param {Object} args - Arguments object.
 * @param {string} args.id - The ID of the student test result to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the student test result.
 * @throws {ApolloError} If the ID is invalid, the result is not found, or another error occurs.
 */
async function GetOneStudentTestResult(_, { _id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Try to find the student test result with the given ID
    const studentTestResult = await StudentTestResultModel.findOne({
      _id: _id,
    }).lean();
    // *************** If not found, throw a NOT_FOUND error
    if (!studentTestResult) {
      throw new ApolloError("Student test result not found", "NOT_FOUND");
    }
    // *************** Return the found student test result
    return studentTestResult;
  } catch (error) {
    // *************** If any unexpected error occurs, throw Apollo Error with error code and message
    throw new ApolloError(
      "Failed to retrieve student test result",
      "GET_STUDENT_TEST_RESULTS_FAILED",
      { error: error.message }
    );
  }
}

/**
 * Update an existing student test result by ID.
 *
 * @async
 * @function UpdateStudentTestResult
 * @param {Object} _ - Unused parent resolver argument (from GraphQL).
 * @param {Object} args - The arguments object.
 * @param {string} args._id - The ID of the student test result to update.
 * @param {Object} args.input - The updated data for the student test result.
 * @param {Array<Object>} args.input.marks - Array of marks with notation_text and mark.
 * @param {Object} context - The GraphQL context (contains auth info, loaders, etc.).
 * @returns {Promise<Object>} The updated student test result object.
 * @throws {ApolloError} If the ID is invalid, input is invalid, data not found, or update fails.
 */
async function UpdateStudentTestResult(_, { _id, input }, context) {
  try {
    // *************** Validate ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Validate input
    ValidateStudentTestResultInput(input);
    // *************** Get the current student test result document
    const currentResult = await StudentTestResultModel.findById(_id).lean();
    if (!currentResult) {
      throw new ApolloError("Student Test Result not found", "NOT_FOUND");
    }
    // *************** Recalculate average_mark from updated marks
    const { marks } = input;
    // *************** Calculate the average_mark
    const average_mark =
      marks.reduce((accumulator, oneMark) => accumulator + oneMark.mark, 0) /
      marks.length;
    // *************** Map the field of the student test result data
    const studentTestResultData = {
      marks: marks.map((oneMark) => ({
        notation_text: oneMark.notation_text,
        mark: oneMark.mark,
      })),
      average_mark,
    };
    // *************** Perform update
    const toUpdatedStudentTestResult =
      await StudentTestResultModel.findByIdAndUpdate(
        _id,
        { $set: studentTestResultData },
        { new: true }
      ).lean();
    // *************** return the Updated student test result
    return toUpdatedStudentTestResult;
    // *************** If an error is accure, then throw Apollo Error
  } catch (error) {
    throw new ApolloError(
      "Failed to update student test result:",
      "STUDENT_TEST_RESULT_UPDATE_FAILED",
      { error: error.message }
    );
  }
}

/**
 * Soft deletes a StudentTestResult document by setting the `deleted_at` timestamp.
 *
 * @param {Object} _ - Unused GraphQL parent argument.
 * @param {Object} args - Arguments passed to the mutation.
 * @param {string} args._id - The ID of the student test result to delete.
 * @returns {Promise<string>} - The ID of the deleted student test result.
 * @throws {ApolloError} - If the ID is invalid or the deletion fails.
 */
async function DeleteStudentTestResult(_, { _id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Perform soft delete and set deleted_at timestamp
    await StudentTestResultModel.updateOne(
      { _id: _id },
      { deleted_at: new Date() }
    );
    return _id;
    // *************** If an error occurs during the update, throw an ApolloError with details
  } catch (error) {
    throw new ApolloError(
      "Failed to delete Student Test Result",
      "STUDENT_TEST RESULT_DELETION_FAILED",
      { error: error.message }
    );
  }
}

// *************** LOADER ***************
/**
 * Field resolver to load a Test document by its ID.
 *
 * @param {Object} parent - The parent object that contains the `test_id` field.
 * @param {any} _ - Unused GraphQL argument placeholder.
 * @param {Object} context - The GraphQL context object, which should include `testLoader`.
 * @param {DataLoader<string, Object>} context.testLoader - DataLoader instance to batch and cache Test document retrievals.
 * @returns {Promise<Object|null>} - The loaded Test document if found, otherwise null.
 */
async function test_id(parent, _, context) {
  // *************** Check if parent.test_id exists
  if (!parent.test_id) {
    // *************** If no test_id is present in the parent object, return null
    return null;
  }
  // *************** Use the testLoader to fetch test document by its ID
  const toLoadedTest = await context.testLoader.load(parent.test_id);
  // *************** Return the loaded student document
  return toLoadedTest;
}

/**
 * Field resolver for `student_id` in the StudentTestResult type.
 * Uses DataLoader to efficiently fetch the student document by its ID.
 *
 * @param {Object} parent - The parent object from the resolver chain, expected to contain `student_id`.
 * @param {Object} _ - Unused GraphQL argument placeholder.
 * @param {Object} context - The GraphQL context, expected to include `studentLoader`.
 * @returns {Promise<Object|null>} - Returns the student document or null if `student_id` is not present.
 */
async function student_id(parent, _, context) {
  // *************** Check if parent.student_id exists
  if (!parent.student_id) {
    // *************** If no student_id is present in the parent object, return null
    return null;
  }
  // *************** Use the StudentLoader to fetch test document by its ID
  const toLoadedStudent = await context.studentLoader.load(parent.student_id);
  // *************** Return the loaded student document
  return toLoadedStudent;
}

// *************** EXPORT MODULE ***************
module.exports = {
  Query: {
    GetAllStudentTestResults,
    GetOneStudentTestResult,
  },
  Mutation: {
    UpdateStudentTestResult,
    DeleteStudentTestResult,
  },
  StudentTestResult: {
    test_id,
    student_id,
  },
};
