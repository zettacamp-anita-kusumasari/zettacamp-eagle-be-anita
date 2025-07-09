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
 * Retrieves a list of student test results based on optional filters:
 * status, test ID, and student ID.
 *
 * @param {any} _ - Unused GraphQL resolver root argument.
 * @param {Object} args - Arguments containing filters.
 * @param {string} [args.student_test_result_status] - Optional filter by result status.
 * @param {string} [args.test_id] - Optional filter by test ID.
 * @param {string} [args.student_id] - Optional filter by student ID.
 * @returns {Promise<Array<Object>>} A promise that resolves to the filtered student test results.
 * @throws {ApolloError} If validation fails or database query encounters an error.
 */
async function GetAllStudentTestResults(
  _,
  { student_test_result_status, test_id, student_id }
) {
  try {
    // *************** Validate input arguments
    ValidateTaskInput({
      student_test_result_status: student_test_result_status,
      test_id: test_id,
      student_id: student_id,
    });
    // *************** Prepare query conditions
    const conditions = {};
    // *************** Add student_test_result_status to conditions if provided
    if (student_test_result_status) {
      conditions.student_test_result_status = student_test_result_status;
    }
    // *************** Validate and add test_id to conditions
    if (test_id) {
      if (!Mongoose.Types.ObjectId.isValid(test_id)) {
        throw new ApolloError("Invalid test ID: " + test_id, "BAD_USER_INPUT");
      }
      conditions.test_id = test_id;
    }
    // *************** Validate and add user_id to conditions
    if (student_id) {
      if (!Mongoose.Types.ObjectId.isValid(student_id)) {
        throw new ApolloError(
          "Invalid student ID: " + student_id,
          "BAD_USER_INPUT"
        );
      }
      conditions.student_id = student_id;
    }
    // *************** If student_test_result_status is not provided, default to fetching only IN_PROGRESS and GRADED tasks
    if (!student_test_result_status) {
      conditions.student_test_result_status = {
        $in: ["IN_PROGRESS", "GRADED"],
      };
    }
    // *************** Fetch tasks from the database
    const studentTestResultStatuses = await StudentTestResultModel.find(
      conditions
    ).lean();
    return studentTestResultStatuses;
  } catch (error) {
    // *************** If any unexpected error occurs, throw Apollo Error with error code and message
    throw new ApolloError(
      `Failed to retrieve student test results: ${error.message}`,
      "GET_STUDENT_TEST_RESULTS_FAILED"
    );
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
async function GetOneStudentTestResult(_, { id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Try to find the student test result with the given ID
    const studentTestResult = await StudentTestResultModel.findOne({
      _id: id,
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
      {
        error: error.message,
      }
    );
  }
}

/**
 * Updates an existing student test result by ID with provided input data.
 *
 * @param {any} _ - Unused GraphQL resolver root argument.
 * @param {Object} args - Arguments object.
 * @param {string} args.id - ID of the student test result to update.
 * @param {Object} args.input - Input data for updating the test result.
 * @param {Array<Object>} args.input.marks - Array of mark objects with notation and value.
 * @param {number} args.input.average_mark - Average mark for the test result.
 * @param {Date} args.input.mark_entry_date - Date when marks were entered.
 * @param {string} args.input.student_test_result_status - Status of the test result.
 * @param {string} args.input.user_id - ID of the user performing the update.
 * @returns {Promise<Object|null>} The updated student test result document, or null if not found.
 * @throws {ApolloError} If validation fails or the update operation encounters an error.
 */
async function UpdateStudentTestResult(_, { id, input }) {
  try {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Validate the input using exported function ValidateStudentTestResultInput
    ValidateStudentTestResultInput(input);
    // *************** Destructure necessary fields from the input object
    const {
      marks,
      average_mark,
      mark_entry_date,
      student_test_result_status,
      user_id,
    } = input;
    // *************** Map input fields to database schema
    const studentTestResultData = {
      marks: marks.map(function (m) {
        return {
          notation_text: m.notation_text,
          mark: m.mark,
        };
      }),
      average_mark: average_mark,
      mark_entry_date: mark_entry_date,
      student_test_result_status: student_test_result_status.toUpperCase(),
      created_by: user_id,
    };
    // *************** Perform the update in the database and return the updated document
    const toUpdatedStudentTestResult =
      await StudentTestResultModel.findOneAndUpdate(
        { _id: id },
        { $set: studentTestResultData },
        { new: true }
      ).lean();
    return toUpdatedStudentTestResult;
  } catch (error) {
    // *************** If an error occurs during the update, throw an ApolloError with details
    throw new ApolloError(
      "Failed to update student test result:",
      "STUDENT_TEST_RESULT_UPDATE_FAILED",
      { error: error.message }
    );
  }
}

/**
 * Performs a soft delete on a student test result by updating its status to 'DELETED'
 * and recording deletion metadata.
 *
 * @param {any} _ - Unused GraphQL resolver root argument.
 * @param {Object} args - Arguments object.
 * @param {string} args.id - The ID of the student test result to delete.
 * @param {string} args.user_id - The ID of the user performing the deletion.
 * @returns {Promise<string>} The ID of the deleted student test result.
 * @throws {ApolloError} If validation fails or deletion cannot be performed.
 */
async function DeleteStudentTestResult(_, { id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Check if the Student Test Result exists and has an ACTIVE status
    const existingStudentTestResult = await StudentTestResultModel.exists({
      _id: id,
      studentTestResult_status: { $in: ["IN_PROGRESS", "GRADED"] },
    }).lean();
    // *************** If Student Test Result is not found or already deleted, throw an error
    if (!existingStudentTestResult) {
      throw new ApolloError(
        "Student Test Result not found or already deleted",
        "NOT_FOUND"
      );
    }
    // *************** Soft delete: update student_test_result_status and set deleted_at timestamp
    await StudentTestResultModel.updateOne(
      { _id: id },
      {
        student_test_result_status: "DELETED",
        deleted_by: user_id,
        deleted_at: new Date(),
      }
    );
    return id;
    // *************** If an error occurs during the update, throw an ApolloError with details
  } catch (error) {
    throw new ApolloError(
      "Failed to delete Student Test Result",
      "STUDENT_TEST RESULT_DELETION_FAILED",
      {
        error: error.message,
      }
    );
  }
}

// *************** LOADER ***************
/**
 * Resolver for load one Test Document in the Student Test Result Model.
 *
 * @param {Object} parent - The parent StudentTestResult object.
 * @param {string} parent.test_id - The ID of the related Test document.
 * @param {any} _ - Unused GraphQL resolver argument (args).
 * @param {Object} context - GraphQL context containing DataLoaders.
 * @param {Object} context.dataLoaders - The collection of DataLoader instances.
 * @param {DataLoader<string, Object|null>} context.dataLoaders.TestLoader - DataLoader to fetch Test documents.
 * @returns {Promise<Object|null>} The corresponding Test document, or null if `test_id` is not present.
 */
async function test(parent, _, context) {
  // *************** Check if parent.test_id exists
  if (!parent.test_id) {
    // *************** If no test_id is present in the parent object, return null
    return null;
  }
  // *************** Use the TestLoader to fetch test document by its ID
  const toLoadedTest = await context.dataLoaders.TestLoader.load(
    parent.test_id
  );
  // *************** Return the loaded test document
  return toLoadedTest;
}

/**
 * Resolver for load one Student Document in the Student Test Result Model.
 *
 * @param {Object} parent - The parent StudentTestResult object.
 * @param {string} parent.student_id - The ID of the related Student document.
 * @param {any} _ - Unused GraphQL resolver argument (args).
 * @param {Object} context - GraphQL context containing DataLoaders.
 * @param {Object} context.dataLoaders - The collection of DataLoader instances.
 * @param {DataLoader<string, Object|null>} context.dataLoaders.StudentLoader - DataLoader to fetch Student documents.
 * @returns {Promise<Object|null>} The corresponding Student document, or null if `student_id` is not present.
 */
async function student(parent, _, context) {
  // *************** Check if parent.student_id exists
  if (!parent.student_id) {
    // *************** If no student_id is present in the parent object, return null
    return null;
  }
  // *************** Use the StudentLoader to fetch test document by its ID
  const toLoadedStudent = await context.dataLoaders.StudentLoader.load(
    parent.student_id
  );
  // *************** Return the loaded student document
  return toLoadedStudent;
}

/**
 * Resolver for fetching the User document associated with the `created_by` field in a StudentTestResult.
 *
 * @param {Object} parent - The parent StudentTestResult object.
 * @param {string} parent.created_by - The ID of the user who created the student test result.
 * @param {any} _ - Unused GraphQL resolver argument (args).
 * @param {Object} context - GraphQL context containing DataLoaders.
 * @param {Object} context.dataLoaders - A collection of DataLoader instances.
 * @param {DataLoader<string, Object|null>} context.dataLoaders.UserLoader - DataLoader to fetch User documents.
 * @returns {Promise<Object|null>} The corresponding User document, or null if `created_by` is not present.
 */
async function created_by(parent, _, context) {
  // *************** Check if the parent object contains the created_by user ID
  if (!parent.created_by) {
    // *************** If created_by is not present, return null (no user to load)
    return null;
  }
  // *************** Use the UserLoader to load the user document based on parent.created_by ID
  const toCreatedByUser = await context.dataLoaders.UserLoader.load(
    parent.created_by
  );
  // *************** Return the loaded user document
  return toCreatedByUser;
}

/**
 * Resolver for fetching the User document associated with the `updated_by` field in a StudentTestResult.
 *
 * @param {Object} parent - The parent StudentTestResult object.
 * @param {string} parent.updated_by - The ID of the user who last updated the student test result.
 * @param {any} _ - Unused GraphQL resolver argument (args).
 * @param {Object} context - GraphQL context containing DataLoaders.
 * @param {Object} context.dataLoaders - A collection of DataLoader instances.
 * @param {DataLoader<string, Object|null>} context.dataLoaders.UserLoader - DataLoader to fetch User documents.
 * @returns {Promise<Object|null>} The corresponding User document, or null if `updated_by` is not present.
 */
async function updated_by(parent, _, context) {
  // *************** Check if the parent object contains the updated_by user ID
  if (!parent.updated_by) {
    // *************** If updated_by is not present, return null (no user to load)
    return null;
  }
  // *************** Use the UserLoader to load the user document based on parent.updated_by ID
  const toUpdatedByUser = await context.dataLoaders.UserLoader.load(
    parent.updated_by
  );
  // *************** Return the loaded user document
  return toUpdatedByUser;
}

/**
 * Resolver for fetching the User document associated with the `deleted_by` field in a StudentTestResult.
 *
 * @param {Object} parent - The parent StudentTestResult object.
 * @param {string} parent.deleted_by - The ID of the user who deleted the student test result.
 * @param {any} _ - Unused GraphQL resolver argument (args).
 * @param {Object} context - GraphQL context containing DataLoaders.
 * @param {Object} context.dataLoaders - A collection of DataLoader instances.
 * @param {DataLoader<string, Object|null>} context.dataLoaders.UserLoader - DataLoader to fetch User documents.
 * @returns {Promise<Object|null>} The corresponding User document, or null if `deleted_by` is not present.
 */
async function deleted_by(parent, _, context) {
  // *************** Check if the parent object contains the deleted_by user ID
  if (!parent.deleted_by) {
    // *************** If deleted_by is not present, return null (no user to load)
    return null;
  }
  // *************** Use the UserLoader to load the user document based on parent.deleted_by ID
  const toDeletedByUser = await context.dataLoaders.UserLoader.load(
    parent.deleted_by
  );
  // *************** Return the loaded user document
  return toDeletedByUser;
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
  Block: {
    test,
    student,
    created_by,
    updated_by,
    deleted_by,
  },
};
