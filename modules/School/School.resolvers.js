// *************** IMPORT CORE ***************
const SchoolModel = require('./School.model');

// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server-express');
const mongoose = require('mongoose');

// *************** LOADER ***************
const CreateSchoolLoader = require('./School.loader');

// *************** IMPORT VALIDATOR ***************
const validateSchool = require('./School.validator');

// *************** QUERY ***************
/**
 * Retrieves all school documents from the database.
 *
 * This function queries the `SchoolModel` to fetch all existing school records.
 * If an error occurs during the database operation, it throws an `ApolloError`
 * with a relevant error message and a status code.
 *
 * @async
 * @function GetAllSchools
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of school objects.
 * @throws {ApolloError} Throws an ApolloError if the database query fails.
 */
async function GetAllSchools() {
  try {
    // *************** Attempt to find and return all school documents from the database
    return await SchoolModel.find();
  } catch (error) {
    // *************** If an error occurs, throw an ApolloError with a message and error code
    throw new ApolloError(`Failed to fetch schools: ${error.message}`, "INTERNAL_SERVER_ERROR");
  }
}

/**
 * Retrieves a single school by its ID using DataLoader with validation and error handling.
 *
 * This resolver function checks if the provided `id` is a valid MongoDB ObjectId.
 * If valid, it attempts to load the corresponding school from the DataLoader (`context.schoolLoader`).
 * If the school does not exist or if any error occurs during the fetch, it throws an appropriate `ApolloError`.
 *
 * @async
 * @function GetOneSchool
 * @param {Object} _ - Unused parent argument from the GraphQL resolver signature.
 * @param {Object} args - The arguments object.
 * @param {string} args.id - The ID of the school to retrieve.
 * @param {Object} context - The GraphQL context object, containing the DataLoader instance.
 * @param {DataLoader<string, Object>} context.schoolLoader - A DataLoader instance for batching and caching school lookups.
 * @returns {Promise<Object>} A promise that resolves to the school object if found and valid.
 * @throws {ApolloError} Throws a `BAD USER INPUT` error if the ID is invalid, `NOT FOUND` if no school is found,
 *   or `INTERNAL SERVER ERROR` if an unexpected error occurs.
 */
async function GetOneSchool(_, { id }, context) {
  // Check if the given ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }
  try {
    // *************** Use DataLoader to load the school from the database (efficient batching & caching)
    const school = await context.schoolLoader.load(id);
    // *************** If no school is found, throw a NOT FOUND error
    if (!school) {
      throw new ApolloError("School not found", "NOT_FOUND");
    }
    // *************** Return the fetched and validated school object
    return school;
  } catch (error) {
    // *************** If any unexpected error occurs, throw a generic internal server error
    throw new ApolloError(`Failed to fetch school: ${error.message}`, "INTERNAL_SERVER_ERROR");
  }
}

// *************** MUTATION ***************
/**
 * Creates a new school document in the database.
 *
 * This resolver function validates the input using `validateSchool`, attaches a default `created_by` user ID
 * (which should later be replaced with the authenticated user's ID), and saves the new school to the database.
 * If an error occurs during validation or saving, it throws an `ApolloError`.
 *
 * @async
 * @function CreateSchool
 * @param {Object} _ - Unused parent argument from the GraphQL resolver signature.
 * @param {Object} args - The arguments object.
 * @param {Object} args.input - The input object containing the school data to be created.
 * @param {string} args.input.name - The name of the school.
 * @param {string} args.input.address - The address of the school.
 * @param {string} args.input.phoneNumber - The contact number of the school.
 * @param {Object} context - (Optional) The GraphQL context, typically containing user/session info.
 * @returns {Promise<Object>} A promise that resolves to the newly created school document.
 * @throws {ApolloError} Throws an error with code `'SCHOOL CREATION FAILED'` if validation or database operations fail.
 */
async function CreateSchool(_, { input }) {
  try {
    // *************** Validate the input using a predefined Joi (or similar) schema
    const validatedInput = validateSchool(input);
    // *************** Temporarily hard-code the user ID who created this school (should be dynamic via auth)
    validatedInput.created_by = '6847af632c3aafcd7ad64244';
    // *************** Create a new school document using the validated input
    const newSchool = new SchoolModel(validatedInput);
    // *************** Save the document to the database and return it
    return await newSchool.save();
  } catch (error) {
    // *************** If validation or database save fails, throw an ApolloError with a custom message and code
    throw new ApolloError(`Failed to create school: ${error.message}`, 'SCHOOL_CREATION_FAILED');
  }
}

/**
 * Updates an existing school document in the database by its ID.
 *
 * This resolver performs the following steps:
 * - Validates the given `id` to ensure it is a valid MongoDB ObjectId.
 * - Validates the `input` data using `validateSchool`.
 * - Sets the `updated_at` timestamp to the current time.
 * - Attempts to update the corresponding school document using `findByIdAndUpdate`.
 * - If no school is found, throws a `NOT FOUND` error.
 * - If any other error occurs, throws an `ApolloError` with an appropriate message and error code.
 *
 * @async
 * @function UpdateSchool
 * @param {Object} _ - Unused parent resolver argument.
 * @param {Object} args - Arguments object.
 * @param {string} args.id - The ID of the school to update.
 * @param {Object} args.input - The input object containing updated school fields.
 * @param {string} [args.input.name] - (Optional) Updated name of the school.
 * @param {string} [args.input.address] - (Optional) Updated address of the school.
 * @param {string} [args.input.phoneNumber] - (Optional) Updated phone number.
 * @returns {Promise<Object>} A promise that resolves to the updated school document.
 * @throws {ApolloError} Throws:
 *   - `BAD USER INPUT` if the ID is invalid,
 *   - `NOT FOUND` if no school with the given ID exists,
 *   - `SCHOOL UPDATE FAILED` for any other errors during the update process.
 */
async function UpdateSchool(_, { id, input }) {
  // *************** Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }
  try {
    // *************** Validate the incoming input using a custom schema (e.g., Joi)
    const validatedInput = validateSchool(input);
    // *************** Add a timestamp to indicate when the update occurred
    validatedInput.updated_at = Date.now();
    // *************** Attempt to update the school by ID, returning the new (updated) document
    const updatedSchool = await SchoolModel.findByIdAndUpdate(id, validatedInput, { new: true });
    // *************** If no matching document is found, throw a NOT FOUND error
    if (!updatedSchool) {
      throw new ApolloError("School not found", "NOT_FOUND");
    }
    // *************** Return the updated school document
    return updatedSchool;
  } catch (error) {
    // *************** If any error occurs during validation or update, throw a custom ApolloError
    throw new ApolloError(`Failed to update school: ${error.message}`, 'SCHOOL_UPDATE_FAILED');
  }
}

/**
 * Soft-deletes a school by its ID by setting `deleted_by` and `deleted_at` fields.
 *
 * This function performs the following steps:
 * - Validates the provided `id` to ensure it's a valid MongoDB ObjectId.
 * - Attempts to update the corresponding school document with `deleted_by` and `deleted_at` fields.
 * - If the school is not found, throws a `NOT FOUND` error.
 * - Returns the updated (soft-deleted) school document.
 *
 * @async
 * @function DeleteSchool
 * @param {Object} _ - Unused parent resolver argument.
 * @param {Object} args - The arguments object.
 * @param {string} args.id - The ID of the school to soft-delete.
 * @returns {Promise<Object>} A promise that resolves to the updated school document with soft-delete markers.
 * @throws {ApolloError} Throws:
 *   - `BAD USER INPUT` if the ID is not a valid ObjectId,
 *   - `NOT FOUND` if no school with the provided ID exists,
 *   - `SCHOOL DELETION FAILED` for any other errors during the operation.
 */
async function DeleteSchool(_, { id }) {
  // *************** Check if the given ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }

  try {
    // *************** ID of the user performing the deletion (should be replaced with authenticated user's ID)
    const deleted_by = '6846e5769e5502fce150eb67';
    // *************** Attempt to update the school document to mark it as deleted
    const deletedSchool = await SchoolModel.findByIdAndUpdate(
      id,
      { deleted_by, deleted_at: Date.now() },
      { new: true }
    );
    // *************** If no school with the given ID is found, throw a NOT FOUND error
    if (!deletedSchool) {
      throw new ApolloError("School not found", "NOT_FOUND");
    }
    // *************** Return the updated (soft-deleted) school document
    return deletedSchool;
  } catch (error) {
    // *************** Throw an internal error if the deletion fails unexpectedly
    throw new ApolloError(`Failed to delete school: ${error.message}`, 'SCHOOL_DELETION_FAILED');
  }
}

// *************** LOADER ***************
/**
 * Loads student data for a given parent object using DataLoader.
 *
 * Typically used as a field resolver in GraphQL to batch and cache requests for associated students.
 *
 * @async
 * @function studentsLoader
 * @param {Object} parent - The parent object that contains a `students` field, typically an array of student IDs.
 * @param {Object} _ - Unused arguments parameter (commonly required by GraphQL resolvers).
 * @param {Object} context - The GraphQL context object, expected to include `studentLoader` (a DataLoader instance).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of student objects.
 * @throws {ApolloError} Throws an ApolloError if loading students fails.
 */
async function studentsLoader(parent, _, context) {
  try {
    // *************** This helps avoid N+1 query problems by batching multiple requests.
    return await context.studentLoader.load(parent.students);
  } catch (error) {
    // *************** Handle errors during the loading process by throwing a GraphQL-friendly ApolloError
    throw new ApolloError(`Failed to load students: ${error.message}`, "STUDENT_LOAD_FAILED");
  }
}

/**
 * Field resolver function to load the user who created a given entity (e.g., School).
 *
 * Uses DataLoader to efficiently retrieve the user document associated with the `created_by` field
 * from the parent object. This helps avoid redundant database queries in GraphQL.
 *
 * @async
 * @function createdByLoader
 * @param {Object} parent - The parent object that contains the `created_by` field (a user ID).
 * @param {Object} _ - Unused argument placeholder (required by GraphQL resolver signature).
 * @param {Object} context - The GraphQL context object containing `userLoader` (a DataLoader instance).
 * @returns {Promise<Object>} A promise that resolves to the user object who created the entity.
 * @throws {ApolloError} If user loading fails, throws an ApolloError with a specific message.
 */
async function createdByLoader(parent, _, context) {
  try {
    // *************** Use DataLoader to fetch the user based on the `created_by` field from the parent object
    return await context.userLoader.load(parent.created_by);
  } catch (error) {
    // *************** If the user cannot be loaded, throw a descriptive ApolloError.
    throw new ApolloError(`Failed to load user: ${error.message}`, "USER_LOAD_FAILED");
  }
}

/**
 * Field resolver function to load the user who deleted a given entity (if applicable).
 *
 * - Retrieves the `deleted_by` field from the parent object.
 * - Uses `context.userLoader` (a DataLoader instance) to fetch the corresponding user.
 * - Returns `null` if the entity was not deleted (i.e., `deleted_by` is undefined or null).
 * - Throws an ApolloError if the user loading process fails.
 *
 * @async
 * @function deletedByLoader
 * @param {Object} parent - The parent object containing the `deleted_by` user ID (optional).
 * @param {Object} _ - Unused GraphQL resolver parameter.
 * @param {Object} context - The GraphQL context object containing the `userLoader` DataLoader.
 * @returns {Promise<Object|null>} A promise that resolves to the user object or `null` if not deleted.
 * @throws {ApolloError} If loading the user fails.
 */
async function deletedByLoader(parent, _, context) {
  try {
    // *************** If the entity has a deleted_by value, load the associated user; otherwise, return null
    return parent.deleted_by ? await context.userLoader.load(parent.deleted_by) : null;
  } catch (error) {
    // *************** If loading fails, throw a GraphQL-friendly error
    throw new ApolloError(`Failed to load user: ${error.message}`, "USER_LOAD_FAILED");
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  Query: { GetAllSchools, GetOneSchool },
  Mutation: { CreateSchool, UpdateSchool, DeleteSchool },
  School: {
    students: studentsLoader,
    created_by: createdByLoader,
    deleted_by: deletedByLoader
  }
};

