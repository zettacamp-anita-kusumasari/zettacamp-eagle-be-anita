// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Mongoose = require("mongoose");

// *************** IMPORT MODULE ***************
const SubjectModel = require("./Subject.model");
const TestModel = require("../Test/Test.model");
const StudentTestResultModel = require("../StudentTestResult/StudentTestResult.model");

// *************** IMPORT VALIDATOR ***************
const { ValidateSubjectInput } = require("./Subject.validator");

// *************** QUERY ***************
/**
 * Retrieves all active subject documents from the database.
 *
 * This function queries the database for subjects where `subject_status` is "ACTIVE"
 * and returns the result as an array. If an error occurs during the query,
 * an ApolloError is thrown with appropriate error details.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of active subject documents.
 * @throws {ApolloError} If an error occurs while fetching data from the database.
 */
async function GetAllSubjects() {
  try {
    // *************** Try to fetch all subjects where status is ACTIVE
    const activeSubjects = await SubjectModel.find({
      subject_status: "ACTIVE",
    }).lean();
    return activeSubjects;
  } catch (error) {
    // *************** If an error occurs, throw an ApolloError with a message and error code
    throw new ApolloError(
      `Failed to fetch subjects: ${error.message}`,
      "INTERNAL_SERVER_ERROR"
    );
  }
}

/**
 * Retrieves a single active subject document by its MongoDB ObjectId.
 *
 * This function validates the given ID, then attempts to retrieve a subject
 * document with status "ACTIVE" from the database. If the subject is not found
 * or the ID is invalid, an appropriate ApolloError is thrown.
 *
 * @param {Object} _ - Unused first GraphQL resolver argument.
 * @param {Object} args - Resolver arguments containing the subject ID.
 * @param {string} args.id - The ID of the subject to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the subject document.
 * @throws {ApolloError} If the ID is invalid, the subject is not found, or a database error occurs.
 */
async function GetOneSubject(_, { id }) {
  try {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Try to find a subject data that has ACTIVE status by its mongoDB ObjectId
    const subject = await SubjectModel.findOne({
      _id: id,
      subject_status: "ACTIVE",
    }).lean();
    // *************** If no subject is found, throw a NOT FOUND error
    if (!subject) {
      throw new ApolloError("Subject not found", "NOT_FOUND");
    }
    // *************** If the system is successful, then return the fetched subject data
    return subject;
  } catch (error) {
    // *************** If an error occurs during the query, throw an ApolloError
    throw new ApolloError(
      `Failed to fetch subject: ${error.message}`,
      "INTERNAL_SERVER_ERROR"
    );
  }
}

/**
 * Calculates the weighted average mark of a student for a given subject.
 *
 * This function fetches all tests under the specified subject, retrieves the student's
 * corresponding test results, and computes the weighted average based on test weights.
 *
 * @param {Object} _ - Unused GraphQL resolver parent parameter.
 * @param {Object} args - Arguments containing subject and student identifiers.
 * @param {string} args.subject_id - The ID of the subject.
 * @param {string} args.student_id - The ID of the student.
 * @returns {Promise<number>} The calculated weighted average.
 * @throws {ApolloError} If input validation fails, tests or results are missing, or calculation errors occur.
 */
async function GetStudentWeightedAverage(_, { subject_id, student_id }) {
  try {
    // *************** Validate that both subject_id and student_id are valid MongoDB ObjectIds
    if (
      !Mongoose.Types.ObjectId.isValid(subject_id) ||
      !Mongoose.Types.ObjectId.isValid(student_id)
    ) {
      // *************** Throw a user input error if either ID is invalid
      throw new ApolloError(
        "Invalid subject_id or student_id",
        "BAD_USER_INPUT"
      );
    }
    // *************** Retrieve all tests associated with the specified subject
    const tests = await TestModel.find({ subject_id }).lean();
    // *************** If no tests are found, throw a not-found error
    if (tests.length === 0) {
      throw new ApolloError("No tests found for this subject", "NO_TEST_FOUND");
    }
    // *************** Extract the _id from each test into an array
    const testIds = tests.map((test) => test._id);
    // *************** Retrieve all student test results matching the student and the subject's tests
    const studentResults = await StudentTestResultModel.find({
      student_id,
      test_id: { $in: testIds },
    }).lean();
    // *************** Build a map of test_id -> average_mark for quick access
    const resultMap = new Map();
    for (const result of studentResults) {
      resultMap.set(result.test_id.toString(), result.average_mark);
    }
    // *************** Initialize total weighted score and total weight
    let totalWeighted = 0;
    let totalWeight = 0;
    // *************** Iterate through each test to calculate the weighted sum
    for (const test of tests) {
      const average = resultMap.get(test._id.toString());
      // *************** Include this test in weighted sum only if the student has a result and the test has a numeric weight
      if (average !== undefined && typeof test.weight === "number") {
        totalWeighted += test.weight * average;
      }
      // *************** Always include the test's weight in the total weight denominator
      if (typeof test.weight === "number") {
        totalWeight += test.weight;
      }
    }
    // *************** Prevent division by zero if no weights were found
    if (totalWeight === 0) {
      throw new ApolloError(
        "Total weight is zero. Can't compute average.",
        "DIVISION_BY_ZERO"
      );
    }
    // *************** Return the final weighted average value
    return totalWeighted / totalWeight;
  } catch (error) {
    // *************** If any unexpected error occurs, throw a general ApolloError
    throw new ApolloError(
      "Failed to calculate weighted average",
      "WEIGHTED_AVERAGE_FAILED",
      {
        error: error.message,
      }
    );
  }
}

// *************** MUTATION ***************
/**
 * Create a new subject and store it in the database.
 *
 * @param {Object} _ - Unused resolver parameter (parent object).
 * @param {Object} args - Arguments passed to the mutation.
 * @param {Object} args.input - Input object containing subject fields.
 * @returns {Promise<Object>} - The created subject document.
 * @throws {ApolloError} - If validation fails or subject creation encounters an error.
 */
async function CreateSubject(_, { input }) {
  try {
    // *************** Validate the input using exported function ValidateSubjectInput
    ValidateSubjectInput(input);
    // *************** Destructure the necessary fields from the input object
    const {
      name,
      description,
      coefficient,
      subject_code,
      subject_status,
      user_id,
    } = input;
    // *************** Map input fields to database schema
    const subjectData = {
      name: name,
      description: description,
      coefficient: coefficient,
      subject_code: subject_code,
      subject_status: subject_status.toUpperCase(),
      created_by: user_id,
    };
    // *************** Save the subject data to the database using Mongoose
    const toCreatedSubject = await SubjectModel.create(subjectData);
    return toCreatedSubject;
  } catch (error) {
    // *************** If an error occurs during the query, throw an ApolloError
    throw new ApolloError(
      "Failed to create subject:",
      "SUBJECT_CREATION_FAILED",
      { error: error.message }
    );
  }
}

/**
 * Update an existing subject document in the database.
 *
 * @param {Object} _ - Unused resolver parameter (parent object).
 * @param {Object} args - Arguments passed to the mutation.
 * @param {string} args.id - The ID of the subject to update.
 * @param {Object} args.input - The input object containing updated subject fields.
 * @returns {Promise<Object|null>} - The updated subject document or null if not found.
 * @throws {ApolloError} - If validation fails or the update operation encounters an error.
 */
async function UpdateSubject(_, { id, input }) {
  try {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Validate the input using exported function ValidateSubjectInput
    ValidateSubjectInput(input);
    // *************** Destructure necessary fields from the input object
    const {
      name,
      description,
      coefficient,
      subject_code,
      subject_status,
      user_id,
    } = input;
    // *************** Map input fields to database schema
    const subjectData = {
      name: name,
      description: description,
      coefficient: coefficient,
      subject_code: subject_code,
      subject_status: subject_status.toUpperCase(),
      created_by: user_id,
    };
    // *************** Perform the update in the database and return the updated document
    const toUpdatedSubject = await SubjectModel.findOneAndUpdate(
      { _id: id },
      { $set: subjectData },
      { new: true }
    ).lean();
    return toUpdatedSubject;
  } catch (error) {
    // *************** If an error occurs during the update, throw an ApolloError with details
    throw new ApolloError(
      "Failed to update subject:",
      "SUBJECT_UPDATE_FAILED",
      { error: error.message }
    );
  }
}

/**
 * Soft delete a subject by updating its status to 'DELETED' and recording deletion metadata.
 *
 * @param {Object} _ - Unused resolver parameter (parent object).
 * @param {Object} args - Arguments passed to the mutation.
 * @param {string} args.id - The ID of the subject to delete.
 * @param {string} args.user_id - The ID of the user performing the deletion.
 * @returns {Promise<string>} - The ID of the deleted subject.
 * @throws {ApolloError} - If validation fails or deletion cannot be completed.
 */
async function DeleteSubject(_, { id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Check if the subject exists and has an ACTIVE status
    const existingSubject = await SubjectModel.exists({
      _id: id,
      subject_status: "ACTIVE",
    });
    // *************** If subject is not found or already deleted, throw an error
    if (!existingSubject) {
      throw new ApolloError(
        "Subject not found or already deleted",
        "NOT_FOUND"
      );
    }
    // *************** Soft delete: update subject_status and set deleted_at timestamp
    await SubjectModel.updateOne(
      { _id: id },
      {
        subject_status: "DELETED",
        deleted_by: user_id,
        deleted_at: new Date(),
      }
    );
    return id;
    // *************** If an error occurs during the update, throw an ApolloError with details
  } catch (error) {
    throw new ApolloError(
      "Failed to delete subject",
      "SUBJECT_DELETION_FAILED",
      {
        error: error.message,
      }
    );
  }
}

// *************** LOADER ***************
/**
 * Resolver to load multiple Test documents in the Subject Model.
 *
 * @param {Object} parent - The parent object containing `test_ids`.
 * @param {Object} _ - Unused arguments object from GraphQL resolver.
 * @param {Object} context - The GraphQL context object containing DataLoaders.
 * @param {DataLoader} context.dataLoaders.TestLoader - DataLoader instance for batching Test queries.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of Test documents or an empty array.
 */
async function test(parent, _, context) {
  // *************** Check if parent.test_id exists
  if (!parent.test_ids) {
    // *************** If no test_id is present in the parent object, return null
    return [];
  }
  // *************** Use the TestLoader to load many test documents by its ID
  const toTestList = await context.dataLoaders.TestLoader.loadMany(
    parent.test_ids
  );
  // *************** Return the loaded test documents
  return toTestList;
}

/**
 * Resolver to load one Block document in the Subject Model.
 *
 * @param {Object} parent - The parent object containing the `block_id` reference.
 * @param {Object} _ - Unused arguments object in GraphQL resolver.
 * @param {Object} context - The GraphQL context object containing DataLoaders.
 * @param {DataLoader} context.dataLoaders.BlockLoader - DataLoader instance for batching Block queries.
 * @returns {Promise<Object|null>} - A promise that resolves to the Block document or null if `block_id` is missing.
 */
async function block(parent, _, context) {
  // *************** Check if parent.block_id exists
  if (!parent.block_id) {
    // *************** If no block_id is present in the parent object, return null
    return null;
  }
  // *************** Use the BlockLoader to fetch block document by its ID
  const toLoadedBlock = await context.dataLoaders.BlockLoader.load(
    parent.block_id
  );
  // *************** Return the loaded block ducument
  return toLoadedBlock;
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
    GetAllSubjects,
    GetOneSubject,
    GetStudentWeightedAverage,
  },
  Mutation: {
    CreateSubject,
    UpdateSubject,
    DeleteSubject,
  },
  Subject: {
    test,
    block,
    created_by,
    updated_by,
    deleted_by,
  },
};
