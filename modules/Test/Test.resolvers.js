// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Mongoose = require("mongoose");

// *************** IMPORT MODULE ***************
const TestModel = require("./Test.model");
const SubjectModel = require("../Subject/Subject.model");
const TaskModel = require("../Task/Task.model");

// *************** IMPORT VALIDATOR ***************
const { ValidateTestInput } = require("./Test.validator");

// *************** QUERY ***************
/**
 * Retrieves all tests with status "NOT_PUBLISHED" or "PUBLISHED".
 *
 * This function queries the database for all test documents where the
 * `test_status` is either "NOT_PUBLISHED" or "PUBLISHED". It returns
 * an array of matching test documents in plain JavaScript object format.
 *
 * @async
 * @function GetAllTests
 * @returns {Promise<Array<Object>>} An array of test documents.
 * @throws {ApolloError} If there is a database error or query failure.
 */
async function GetAllTests() {
  try {
    // *************** Try to fetch all tests where status is PUBLISHED and NOT_PUBLISHED 
    const activeTests = await TestModel.find({
      test_status: { $in: ["NOT_PUBLISHED", "PUBLISHED"] },
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
 * Retrieves a single test document by its MongoDB ObjectId.
 *
 * This function validates the provided `id` to ensure it is a valid MongoDB ObjectId,
 * then searches for a test document with that `_id` and a `test_status` of either
 * "NOT_PUBLISHED" or "PUBLISHED". If found, the test document is returned.
 *
 * @async
 * @function GetOneTest
 * @param {Object} _ - Parent resolver (unused).
 * @param {Object} args - Arguments passed to the resolver.
 * @param {string} args.id - The MongoDB ObjectId of the test to retrieve.
 * @returns {Promise<Object>} The test document if found.
 * @throws {ApolloError} If the ID is invalid, test not found, or query fails.
 */
async function GetOneTest(_, { _id }) {
  try {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Try to find a test data that has PUBLISHED status by its mongoDB ObjectId
    const test = await TestModel.findOne({
      _id: _id,
      test_status: { $in: ["NOT_PUBLISHED", "PUBLISHED"] },
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
      subject_id,
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
      subject_id: subject_id,
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
      created_by: user_id,
    };
    // *************** Save the test data to the database using Mongoose
    const toCreatedTest = await TestModel.create(testData);
    // *************** Push the test _id into the related block's test_ids array
    await SubjectModel.updateOne(
      { _id: subject_id },
      { $push: { test_ids: toCreatedTest._id } }
    );
    // *************** Return toCreatedTest to created a test
    return toCreatedTest;
  } catch (error) {
    // *************** If an error occurs during the mutation, throw an ApolloError
    throw new ApolloError("Failed to create test:", "TEST_CREATION_FAILED", {
      error: error.message,
    });
  }
}

/**
 * Publishes a test and creates an associated ASSIGN_CORRECTOR task.
 *
 * Steps performed:
 * - Validates the provided test ID.
 * - Finds a test with status "NOT_PUBLISHED" and the matching ID.
 * - Updates the test's `test_status` to "PUBLISHED" and sets the `published_date`.
 * - Creates a task with `task_type: ASSIGN_CORRECTOR` and due date set to 3 days from today.
 * - Returns the updated test and the newly created task.
 *
 * @async
 * @function PublishTest
 * @param {Object} _ - Parent resolver (not used).
 * @param {Object} args - Arguments object.
 * @param {string} args._id - The MongoDB ObjectId of the test to publish.
 * @returns {Promise<{ test: Object, task: Object }>} An object containing the updated test and the created task.
 * @throws {ApolloError} If the ID is invalid, test not found, or any operation fails.
 */
async function PublishTest(_, { _id }) {
  try {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Find test with NOT_PUBLISHED status and matching ID
    const existingTest = await TestModel.findOne({
      _id,
      test_status: "NOT_PUBLISHED",
    });
    // *************** Check if the test is exist
    if (!existingTest) {
      throw new ApolloError("Test not found or already published.", "NOT_FOUND");
    }
    // *************** Update the Test
    await TestModel.updateOne(
      { _id },
      {
        published_date: new Date(),
        test_status: "PUBLISHED",
      }
    );
    // *************** Assign ASSIGN_CORRECTOR Task
    const assignTask = await TaskModel.create({
      test_id: _id,
      task_type: "ASSIGN_CORRECTOR",
      task_status: "PENDING",
      due_date: new Date(new Date().setHours(0, 0, 0, 0) + 3 * 86400000),
    });
    // *************** Get the test data that has been updated
    const updatedTest = await TestModel.findById(_id);
    // *************** Return the updated test and assined task
    return {
      test: updatedTest,
      task: assignTask,
    };;
  } catch (error) {
    // *************** If an error occurs during the mutation, throw an ApolloError
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
async function UpdateTest(_, { _id, input }) {
  try {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Validate the input using exported function ValidateTestInput
    ValidateTestInput(input);
    // *************** Destructure necessary fields from the input object
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
    // *************** (Map input fields to database schema) Construct a new block data object to be used for update
    const testData = {
      name: name,
      subject_id: subject_id,
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
      updated_by: user_id,
    };
    // *************** Perform the update in the database and return the updated document
    const toUpdatedTest = await TestModel.findByIdAndUpdate(
      _id,
      { $set: testData },
      { new: true }
    ).lean();
    // *************** Return toUpdatedTest to Updated a Test
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
async function DeleteTest(_, { _id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Check if the test exists and has an ACTIVE status
    const existingTest = await TestModel.exists({
      test_status: { $in: ["NOT_PUBLISHED", "PUBLISHED"] },
    });
    // *************** If test is not found or already deleted, throw an error
    if (!existingTest) {
      throw new ApolloError("Test not found or already deleted", "NOT_FOUND");
    }
    // *************** Soft delete: update test_status and set deleted_at timestamp
    await TestModel.updateOne({ _id: _id }, { test_status: "DELETED" });
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
async function subject_id(parent, _, context) {
  // *************** Check if parent.subject_id exists
  if (!parent.subject_id) {
    // *************** If no subject_id is present in the parent object, return null
    return null;
  }
  // *************** Use the SubjectLoader to fetch subject document by its ID
  const toLoadedSubject = await context.subjectLoader.load(parent.subject_id);
  // *************** Return the loaded subject document
  return toLoadedSubject;
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
    subject_id,
  },
};
