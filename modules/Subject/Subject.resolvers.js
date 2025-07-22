// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Mongoose = require("mongoose");

// *************** IMPORT MODULE ***************
const SubjectModel = require("./Subject.model");
const BlockModel = require("../Block/Block.model");

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
    // *************** If the system is successful, then return the fetched subject data
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
async function GetOneSubject(_, { _id }) {
  try {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Try to find a subject data that has ACTIVE status by its mongoDB ObjectId
    const subject = await SubjectModel.findOne({
      _id: _id,
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
      block_id,
      description,
      coefficient,
      subject_code,
      subject_status,
      user_id,
    } = input;
    // *************** Map input fields to database schema
    const subjectData = {
      name: name,
      block_id: block_id,
      description: description,
      coefficient: coefficient,
      subject_code: subject_code,
      subject_status: subject_status.toUpperCase(),
      created_by: user_id,
    };
    // *************** Save the subject data to the database using Mongoose
    const CreatedSubject = await SubjectModel.create(subjectData);
    // *************** Push the subject _id into the related block's subject_ids array
    await BlockModel.updateOne(
      { _id: block_id },
      { $push: { subject_ids: CreatedSubject._id } }
    );
    // *************** Return CreatedSubject to created a subject
    return CreatedSubject;
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
async function UpdateSubject(_, { _id, input }) {
  try {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Validate the input using exported function ValidateSubjectInput
    ValidateSubjectInput(input);
    // *************** Destructure necessary fields from the input object
    const {
      name,
      block_id,
      description,
      coefficient,
      subject_code,
      subject_status,
      user_id,
    } = input;
    // *************** Map input fields to database schema
    const subjectData = {
      name: name,
      block_id: block_id,
      description: description,
      coefficient: coefficient,
      subject_code: subject_code,
      subject_status: subject_status.toUpperCase(),
      updated_by: user_id,
    };
    // *************** Perform the update in the database and return the updated document
    const UpdatedSubject = await SubjectModel.findByIdAndUpdate(
      _id,
      { $set: subjectData },
      { new: true }
    ).lean();
    // *************** Return UpdatedSubject to Update a subject
    return UpdatedSubject;
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
async function DeleteSubject(_, { _id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Check if the subject exists and has an ACTIVE status
    const existingSubject = await SubjectModel.exists({ subject_status: "ACTIVE" });
    // *************** If subject is not found or already deleted, throw an error
    if (!existingSubject) {
      throw new ApolloError(
        "Subject not found or already deleted",
        "NOT_FOUND"
      );
    }
    // *************** Soft delete: update subject_status and set deleted_at timestamp
    await SubjectModel.updateOne({ _id: _id }, { subject_status: "DELETED" });
    return _id;
    // *************** If an error occurs during the update, throw an ApolloError with details
  } catch (error) {
    throw new ApolloError(
      "Failed to delete subject",
      "SUBJECT_DELETION_FAILED",
      { error: error.message }
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
async function test_ids(parent, _, context) {
  // *************** Check if parent.test_id exists
  if (!parent.test_ids) {
    // *************** If no test_id is present in the parent object, return null
    return [];
  }
  // *************** Use the TestLoader to load many test documents by its ID
  const TestList = await context.testLoader.loadMany(parent.test_ids);
  // *************** Return the loaded test documents
  return TestList;
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
async function block_id(parent, _, context) {
  // *************** Check if parent.block_id exists
  if (!parent.block_id) {
    // *************** If no block_id is present in the parent object, return null
    return null;
  }
  // *************** Use the BlockLoader to fetch block document by its ID
  const LoadedBlock = await context.blockLoader.load(parent.block_id);
  // *************** Return the loaded block ducument
  return LoadedBlock;
}

// *************** EXPORT MODULE ***************
module.exports = {
  Query: {
    GetAllSubjects,
    GetOneSubject,
  },
  Mutation: {
    CreateSubject,
    UpdateSubject,
    DeleteSubject,
  },
  Subject: {
    test_ids,
    block_id,
  },
};
