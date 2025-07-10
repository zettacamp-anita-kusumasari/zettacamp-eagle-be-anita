// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Mongoose = require("mongoose");

// *************** IMPORT MODULE ***************
const TestModel = require("./Test.model");
const TaskModel = require("../Task/Task.model");

// *************** IMPORT VALIDATOR ***************
const { ValidateTestInput } = require("./Test.validator");

// *************** QUERY ***************
/**
 * Retrieves all tests with the status 'PUBLISHED'.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of published test documents.
 * @throws {ApolloError} If the query fails or encounters an error.
 */
async function GetAllTests() {
  try {
    // *************** Try to fetch all tests where status is PUBLISHED
    const activeTests = await TestModel.find({
      test_status: "NOT_PUBLISHED",
    }).lean();
    // *************** Return the array of published tests
    return activeTests;
  } catch (error) {
    // *************** If an error occurs, throw an ApolloError with a message and error code
    throw new ApolloError(
      `Failed to fetch tests: ${error.message}`,
      "INTERNAL_SERVER_ERROR"
    );
  }
}

/**
 * Retrieves a single test document by its ID, only if its status is 'PUBLISHED'.
 *
 * @param {Object} _ - Unused parent resolver argument.
 * @param {Object} args - The arguments object containing the test ID.
 * @param {string} args.id - The ID of the test to retrieve.
 * @returns {Promise<Object>} The test document if found.
 * @throws {ApolloError} If the ID is invalid, the test is not found, or a database error occurs.
 */
async function GetOneTest(_, { id }) {
  try {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Try to find a test data that has PUBLISHED status by its mongoDB ObjectId
    const test = await TestModel.findOne({
      _id: id,
      test_status: "NOT_PUBLISHED",
    }).lean();
    // *************** If no test is found, throw a NOT FOUND error
    if (!test) {
      throw new ApolloError("Test not found", "NOT_FOUND");
    }
    // *************** If the system is successful, then return the fetched test data
    return test;
  } catch (error) {
    // *************** If an error occurs during the query, throw an ApolloError
    throw new ApolloError(
      `Failed to fetch test: ${error.message}`,
      "INTERNAL_SERVER_ERROR"
    );
  }
}

// *************** MUTATION ***************
/**
 * Creates a new test entry in the database after validating the input.
 *
 * @param {Object} _ - Unused parent resolver argument.
 * @param {Object} args - Arguments containing input data for the test.
 * @param {Object} args.input - The test creation input object.
 * @param {string} args.input.name - The name of the test.
 * @param {string} args.input.description - Description of the test.
 * @param {number} args.input.weight - The weight of the test in the subject.
 * @param {Array<{ notation_text: string, max_point: number }>} args.input.notations - Notation criteria.
 * @param {string} args.input.test_status - Status of the test (e.g., "DRAFT", "PUBLISHED").
 * @param {boolean} args.input.for_retake - Indicates if the test is for retake.
 * @param {Date} args.input.published_date - Scheduled published date.
 * @param {string} args.input.user_id - The ID of the user creating the test.
 *
 * @returns {Promise<Object>} The created test document.
 * @throws {ApolloError} If input validation fails or database operation fails.
 */
async function CreateTest(_, { input }) {
  try {
    // *************** Validate the input using exported function ValidateTestInput
    ValidateTestInput(input);
    // *************** Destructure the necessary fields from the input object
    const {
      name,
      description,
      weight,
      notations,
      test_status,
      for_retake,
      published_date,
      user_id,
    } = input;
    // *************** Map input fields to database schema
    const testData = {
      name: name,
      description: description,
      weight: weight,
      notations: notations.map(function (n) {
        return {
          notation_text: n.notation_text,
          max_point: n.max_point,
        };
      }),
      test_status: test_status.toUpperCase(),
      for_retake: for_retake,
      published_date: published_date,
      user_id: user_id,
    };
    // *************** Save the test data to the database using Mongoose
    const toCreatedTest = await TestModel.create(testData);
    return toCreatedTest;
  } catch (error) {
    // *************** If an error occurs during the query, throw an ApolloError
    throw new ApolloError("Failed to create test:", "TEST_CREATION_FAILED", {
      error: error.message,
    });
  }
}

/**
 * Publishes a test by updating its details and assigning an initial task (ASSIGN_CORRECTOR).
 *
 * @param {Object} _ - Unused parent resolver argument.
 * @param {Object} args - GraphQL mutation arguments.
 * @param {string} args.id - The ID of the test to publish.
 * @param {Object} args.input - The updated test data.
 * @param {string} args.input.name - Name of the test.
 * @param {string} args.input.description - Description of the test.
 * @param {number} args.input.weight - Weight of the test.
 * @param {Array<{ notation_text: string, max_point: number }>} args.input.notations - Notation criteria for grading.
 * @param {string} args.input.test_status - The status of the test ("PUBLISHED", etc.).
 * @param {boolean} args.input.for_retake - Indicates if this test is for a retake.
 * @param {Date} args.input.published_date - The scheduled date to publish.
 * @param {string} args.input.user_id - The user ID performing the operation.
 *
 * @returns {Promise<Object>} The updated test document.
 * @throws {ApolloError} If validation or update fails.
 */
async function PublishTest(_, { id, input }) {
  try {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Destructure input
    const {
      name,
      description,
      weight,
      notations,
      test_status,
      for_retake,
      published_date,
      user_id,
    } = input;
    // *************** Validate the input
    ValidateTestInput(input);
    // *************** Prepare the new test data
    const testData = {
      name: name,
      description: description,
      weight: weight,
      notations: notations.map((n) => ({
        notation_text: n.notation_text,
        max_point: n.max_point,
      })),
      test_status: (test_status || "NOT_PUBLISHED").toUpperCase(),
      for_retake: for_retake,
      published_date: published_date,
      user_id: user_id,
    };
    const test = await TestModel.findById(id).lean();
    // *************** Update field in the instance test
    Object.assign(test, testData);
    // *************** Save the test that has been updated
    // const updatedTest = await test.create();
    const updatedTest = await TestModel.create(testData);
    // *************** Assign new task: ASSIGN_CORRECTOR
    const assignTask = new TaskModel({
      test_id: updatedTest._id,
      task_type: "ASSIGN_CORRECTOR",
      task_status: "PENDING",
      user_id: user_id,
      due_date: new Date(new Date().setHours(0, 0, 0, 0) + 3 * 86400000),
    });
    await assignTask.save();
    // *************** Return updated test
    return updatedTest;
  } catch (error) {
    throw new ApolloError("Failed to publish test.", "TEST_PUBLISH_FAILED", {
      error: error.message,
    });
  }
}

/**
 * Updates a test by its ID using the provided input fields.
 *
 * @param {Object} _ - Unused parent resolver argument.
 * @param {Object} args - GraphQL arguments containing ID and input.
 * @param {string} args.id - The ID of the test to be updated.
 * @param {Object} args.input - The updated test data.
 * @param {string} args.input.name - Name of the test.
 * @param {string} args.input.description - Description of the test.
 * @param {number} args.input.weight - Weight or bobot of the test.
 * @param {Array<{ notation_text: string, max_point: number }>} args.input.notations - Grading notations.
 * @param {string} args.input.test_status - Status of the test (e.g., "PUBLISHED").
 * @param {boolean} args.input.for_retake - Whether this test is a retake.
 * @param {Date} args.input.published_date - Scheduled publish date.
 * @param {string} args.input.user_id - ID of the user performing the update.
 *
 * @returns {Promise<Object>} The updated test document.
 * @throws {ApolloError} If ID is invalid, validation fails, or update operation fails.
 */
async function UpdateTest(_, { id, input }) {
  try {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Validate the input using exported function ValidateTestInput
    ValidateTestInput(input);
    // *************** Destructure necessary fields from the input object
    const {
      name,
      description,
      weight,
      notations,
      test_status,
      for_retake,
      published_date,
      user_id,
    } = input;
    // *************** (Map input fields to database schema) Construct a new block data object to be used for update
    const testData = {
      name: name,
      description: description,
      weight: weight,
      notations: notations.map(function (n) {
        return {
          notation_text: n.notation_text,
          max_point: n.max_point,
        };
      }),
      test_status: test_status.toUpperCase(),
      for_retake: for_retake,
      published_date: published_date,
      user_id: user_id,
    };
    // *************** Perform the update in the database and return the updated document
    const toUpdatedTest = await TestModel.findByIdAndUpdate(
      id,
      { $set: testData },
      { new: true }
    ).lean();
    return toUpdatedTest;
  } catch (error) {
    // *************** If an error occurs during the update, throw an ApolloError with details
    throw new ApolloError("Failed to update test:", "TEST_UPDATE_FAILED", {
      error: error.message,
    });
  }
}

/**
 * Soft deletes a test by setting its status to "DELETED" and recording the deletion metadata.
 *
 * @param {Object} _ - Unused parent resolver argument.
 * @param {Object} args - GraphQL arguments containing ID and user_id.
 * @param {string} args.id - The ID of the test to delete.
 * @param {string} args.user_id - The ID of the user performing the deletion.
 *
 * @returns {Promise<string>} The ID of the deleted test.
 * @throws {ApolloError} If the ID is invalid, the test is not found, or deletion fails.
 */
async function DeleteTest(_, { _id, user_id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Check if the test exists and has an ACTIVE status
    const existingTest = await TestModel.exists({
      _id: _id,
      test_status: { $in: ["NOT_PUBLISHED", "PUBLISHED"] },
    });
    // *************** If test is not found or already deleted, throw an error
    if (!existingTest) {
      throw new ApolloError("Test not found or already deleted", "NOT_FOUND");
    }
    // *************** Soft delete: update test_status and set deleted_at timestamp
    await TestModel.updateOne(
      { _id: _id },
      {
        test_status: "DELETED",
        deleted_by: user_id,
        deleted_at: new Date(),
      }
    );
    return _id;
    // *************** If an error occurs during the update, throw an ApolloError with details
  } catch (error) {
    throw new ApolloError("Failed to delete test", "TEST_DELETION_FAILED", {
      error: error.message,
    });
  }
}

// *************** LOADER ***************
/**
 * Resolver function to load Multiple Student Test Result Documents in the Test Model.
 *
 * @param {Object} parent - The parent object that contains the studentTestResults field.
 * @param {Object} _ - Unused GraphQL argument (placeholder for args).
 * @param {Object} context - The context object that holds shared utilities like DataLoaders.
 * @param {Object} context.dataLoaders - An object containing all DataLoaders.
 * @param {DataLoader} context.dataLoaders.StudentTestResultLoader - DataLoader instance for batching StudentTestResult fetches.
 *
 * @returns {Promise<Array<Object>>} - Returns a promise that resolves to an array of StudentTestResult documents.
 */
async function studentTestResult(parent, _, context) {
  // *************** Check if parent.subject_id exists
  if (!parent.studentTestResults) {
    // *************** If no subject_id is present in the parent object, return null
    return [];
  }
  // *************** Use the StudentTestResultLoader to load many student test result documents by its ID
  const toStudentTestResultList =
    await context.dataLoaders.StudentTestResultLoader.loadMany(
      parent.studentTestResults
    );
  // *************** Return the loaded student test result documents
  return toStudentTestResultList;
}

/**
 * Resolver function to load multiple Task documents in the Test Model.
 *
 * @param {Object} parent - The parent Test object that contains the `tasks` field (array of Task IDs).
 * @param {Object} _ - Unused GraphQL argument (placeholder for args).
 * @param {Object} context - The context object that holds shared utilities like DataLoaders.
 * @param {Object} context.dataLoaders - An object containing all DataLoader instances.
 * @param {DataLoader} context.dataLoaders.TaskLoader - DataLoader instance for batching Task fetches.
 *
 * @returns {Promise<Array<Object>>} - Returns a promise that resolves to an array of Task documents.
 */
async function task(parent, _, context) {
  // *************** Check if parent.tasks exists
  if (!parent.tasks) {
    // *************** If no tasks is present in the parent object, return null
    return [];
  }
  // *************** Use the TaskLoader to load many task documents by its ID
  const toTaskList = await context.dataLoaders.TaskLoader.loadMany(
    parent.tasks
  );
  // *************** Return the loaded task documents
  return toTaskList;
}

/**
 * Resolver function to load one Subject Document in the Test Model.
 *
 * @param {Object} parent - The parent object that contains the `subject_id` field.
 * @param {Object} _ - Unused GraphQL argument (placeholder for args).
 * @param {Object} context - The context object that holds shared utilities like DataLoaders.
 * @param {Object} context.dataLoaders - An object containing all DataLoader instances.
 * @param {DataLoader} context.dataLoaders.SubjectLoader - DataLoader instance for batching Subject fetches.
 *
 * @returns {Promise<Object|null>} - Returns a promise that resolves to the Subject document or null if not found.
 */
async function subject(parent, _, context) {
  // *************** Check if parent.subject_id exists
  if (!parent.subject_id) {
    // *************** If no subject_id is present in the parent object, return null
    return null;
  }
  // *************** Use the SubjectLoader to fetch subject document by its ID
  const toLoadedSubject = await context.dataLoaders.SubjectLoader.load(
    parent.subject_id
  );
  // *************** Return the loaded subject document
  return toLoadedSubject;
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
    GetAllTests,
    GetOneTest,
  },
  Mutation: {
    CreateTest,
    PublishTest,
    UpdateTest,
    DeleteTest,
  },
  Test: {
    studentTestResult,
    task,
    subject,
    created_by,
    updated_by,
    deleted_by,
  },
};
