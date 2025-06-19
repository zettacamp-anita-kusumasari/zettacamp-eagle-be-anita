// *************** IMPORT MODULE ***************
const UserModel = require('./User.model');

// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Mongoose = require('mongoose');

// *************** IMPORT VALIDATOR ***************
const { ValidateUserInput } = require('./User.validator');

// *************** QUERY ***************
/**
 * Get all users with 'ACTIVE' status from the database.
 *
 * This function retrieves all user documents from the UserModel collection
 * where the user_status is set to 'ACTIVE'.
 *
 * @async
 * @function GetAllUsers
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of active users.
 * @throws {ApolloError} - If the database query fails, an ApolloError is thrown with a message and error code.
 */
async function GetAllUsers() {
  try {
    // *************** Query the UserModel to find all users whose status is 'ACTIVE'
    return await UserModel.find({ user_status: 'ACTIVE' });
  } catch (error) {
    // *************** If an error occurs during the database query, throw an ApolloError with details
    throw new ApolloError(`Failed to fetch users: ${error.message}`, "INTERNAL_SERVER_ERROR");
  }
}

/**
 * Retrieves a single active user by ID.
 *
 * This function validates the provided ID and attempts to find a user document
 * in the database where the `_id` matches the given ID and `user_status` is `'ACTIVE'`.
 * If the ID is invalid, or the user is not found, it throws an `ApolloError`.
 *
 * @async
 * @function GetOneUser
 * @param {Object} _ - Unused first parameter (GraphQL resolver convention).
 * @param {Object} args - The arguments object containing the user ID.
 * @param {string} args.id - The ID of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the user object if found.
 * @throws {ApolloError} - If the ID is invalid, user is not found, or database query fails.
 */
async function GetOneUser(_, { id }) {
  // *************** Validate if the provided ID is a valid MongoDB ObjectId
  if (!Mongoose.Types.ObjectId.isValid(id)) {
    // *************** If not valid, throw an ApolloError indicating bad user input
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }
  try {
    // *************** Query the database for a user with the given ID and status 'ACTIVE'
    const user = await UserModel.findOne({ _id: id, user_status: 'ACTIVE' });
    // *************** If no matching user is found, throw an ApolloError with 'NOT_FOUND' code
    if (!user) {
      throw new ApolloError("User not found", "NOT_FOUND");
    }
    // *************** Return the found user document
    return user;
  } catch (error) {
    // *************** If an error occurs during the query, throw an ApolloError with details
    throw new ApolloError(`Failed to fetch user: ${error.message}`, "INTERNAL_SERVER_ERROR");
  }
}

// *************** MUTATION ***************
/**
 * Creates a new user document in the database.
 *
 * This function validates the input using `ValidateUserInput`, then constructs a new user object
 * including metadata (created_by, updated_by), and inserts it into the database using Mongoose.
 *
 * @async
 * @function CreateUser
 * @param {Object} _ - Unused parameter (GraphQL resolver convention).
 * @param {Object} args - Arguments containing the input data for the user.
 * @param {Object} args.input - The user input object to be validated and stored.
 * @returns {Promise<Object>} - A promise that resolves to the newly created user document.
 * @throws {ApolloError} - If validation fails or database creation throws an error.
 */
async function CreateUser(_, { input }) {
  // *************** Validate the input fields using a custom validation function
  ValidateUserInput(input);
  try {
    // *************** Hardcoded creator ID to associate the creator of the user
    const creatorId = '6846e5769e5502fce150eb67';
    // *************** Construct the user data with additional metadata (created_by, updated_by)
    const userData = {
      ...input, // spread original input fields
      user_status: input.user_status.toUpperCase(), // normalize status to uppercase
      created_by: creatorId,
      updated_by: creatorId
    };
    // *************** Create a new user document in the database
    return await UserModel.create(userData);
  } catch (error) {
    // *************** Throw an ApolloError if any error occurs during creation
    throw new ApolloError('Failed to create user.', 'USER_CREATION_FAILED', {error: error.message});
  }
}

/**
 * Updates an existing user document in the database.
 *
 * This function validates the input and user ID, then updates the user document
 * with the new data and metadata using Mongoose's `findOneAndUpdate`.
 *
 * @async
 * @function UpdateUser
 * @param {Object} _ - Unused parameter (GraphQL resolver convention).
 * @param {Object} args - GraphQL arguments containing the user ID and input data.
 * @param {string} args.id - The MongoDB ObjectId of the user to be updated.
 * @param {Object} args.input - The updated user data.
 * @returns {Promise<Object>} - The updated user document.
 * @throws {ApolloError} - If ID is invalid, validation fails, or the update process encounters an error.
 */
async function UpdateUser(_, { id, input }) {
  // *************** Validate the format of the provided ID
  if (!Mongoose.Types.ObjectId.isValid(id)) {
    // *************** Throw an error if the ID is not a valid MongoDB ObjectId
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }
  // *************** Validate the user input fields
  ValidateUserInput(input);
  try {
    // *************** Hardcoded updater ID to track who updated the data
    const updaterId = '6846e5769e5502fce150eb67';
    // *************** Spread the input fields
    const userData = {
      ...input,
      user_status: input.user_status.toUpperCase(), // Normalize status to uppercase
      updated_by: updaterId
    };

    // *************** Update the user document in the database and return the new version
    return await UserModel.findOneAndUpdate({ _id: id }, userData, { new: true });
  } catch (error) {
    // *************** Handle and throw any errors during the update operation
    throw new ApolloError('Failed to update user.', 'USER_UPDATE_FAILED', {error: error.message});
  }
}

/**
 * Soft deletes a user by updating their status and deletion metadata.
 *
 * This function checks if the provided ID is valid, then updates the user's
 * status to "DELETED" along with who deleted it and when.
 *
 * @async
 * @function DeleteUser
 * @param {Object} _ - Unused parameter (GraphQL resolver convention).
 * @param {Object} args - GraphQL arguments containing the user ID.
 * @param {string} args.id - The MongoDB ObjectId of the user to delete.
 * @returns {Promise<Object>} - The updated user document after soft deletion.
 * @throws {ApolloError} - If the ID is invalid or the deletion process fails.
 */
async function DeleteUser(_, { id }) {
  // *************** Validate whether the provided ID is a valid MongoDB ObjectId
  if (!Mongoose.Types.ObjectId.isValid(id)) {
    // *************** If invalid, throw an ApolloError with a specific error code
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }
  try {
    // *************** Hardcoded user ID that represents the deleter (usually should be from context)
    const deleterId = '6846e5769e5502fce150eb67';
    // *************** Prepare the fields to mark the user as deleted (soft delete)
    const userData = {
      user_status: 'INACTIVE', 
      deleted_by: deleterId,
      deleted_at: Date.now()
    };
    // *************** Update the user document with the soft delete info and return the updated doc
    return await UserModel.findOneAndUpdate({ _id: id }, userData, { new: true });
  } catch (error) {
    // *************** If any error occurs during the process, throw ApolloError with details
    throw new ApolloError('Failed to delete user.', 'USER_DELETION_FAILED', {error: error.message});
  }
}

// *************** LOADER ***************
/**
 * DataLoader resolver to fetch the user who created the current document.
 *
 * This function uses the UserLoader DataLoader instance from the context
 * to efficiently fetch the user document associated with `created_by` field.
 *
 * @async
 * @function CreatedByLoader
 * @param {Object} parent - The parent object that contains the `created_by` field.
 * @param {Object} _ - Unused GraphQL resolver argument.
 * @param {Object} context - GraphQL context containing shared resources like DataLoaders.
 * @returns {Promise<Object>} - The user document who created the parent object.
 * @throws {ApolloError} - If the user cannot be fetched.
 */
async function CreatedByLoader(parent, _, context) {
  try {
    // *************** Use the UserLoader DataLoader to fetch the user who created this record
    return await context.dataLoaders.UserLoader.load(parent.created_by);
  } catch (error) {
    // *************** If any error occurs while fetching, throw an ApolloError with a custom code
    throw new ApolloError(`Failed to fetch creator: ${error.message}`, 'USER_FETCH_FAILED');
  }
}

/**
 * DataLoader resolver to fetch the user who last updated the current document.
 *
 * This function utilizes the UserLoader from the context to efficiently fetch
 * the user associated with the `updated_by` field, reducing redundant database queries.
 *
 * @async
 * @function UpdatedByLoader
 * @param {Object} parent - The parent object containing the `updated_by` field.
 * @param {Object} _ - Unused GraphQL resolver argument (usually args).
 * @param {Object} context - GraphQL context containing DataLoader instances.
 * @returns {Promise<Object>} - Returns the user document who last updated the parent object.
 * @throws {ApolloError} - Throws if user fetching fails.
 */
async function UpdatedByLoader(parent, _, context) {
  try {
    // *************** Use the UserLoader from context to fetch the user by ID in parent.updated_by
    return await context.dataLoaders.UserLoader.load(parent.updated_by);
  } catch (error) {
    // *************** If fetching fails, throw an ApolloError with a custom error code and message
    throw new ApolloError(`Failed to fetch updater: ${error.message}`, 'USER_FETCH_FAILED');
  }
}
/**
 * DataLoader resolver to fetch the user who deleted the current document.
 *
 * This function checks if the `deleted_by` field exists in the parent object.
 * If present, it uses the `UserLoader` from the context to fetch the user by ID.
 * If not, it returns `null`.
 *
 * @async
 * @function DeletedByLoader
 * @param {Object} parent - The parent object containing the `deleted_by` field.
 * @param {Object} _ - Unused GraphQL resolver argument.
 * @param {Object} context - The context object containing DataLoader instances.
 * @returns {Promise<Object|null>} - Returns the user document who deleted the parent, or null if not available.
 * @throws {ApolloError} - Throws an error if user fetching fails.
 */
async function DeletedByLoader(parent, _, context) {
  try {
    // *************** Check if the parent object has a deleted_by field
    if (parent.deleted_by) {
      // *************** Load and return the user who deleted the data using DataLoader
      return await context.dataLoaders.UserLoader.load(parent.deleted_by);
    } else {
      // *************** If deleted_by is not available, return null
      return null;
    }
  } catch (error) {
    // *************** If an error occurs during loading, throw an ApolloError with a specific code and message
    throw new ApolloError(`Failed to fetch deleter: ${error.message}`, 'USER_FETCH_FAILED');
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  Query: {
    GetAllUsers,
    GetOneUser
  },
  Mutation: {
    CreateUser,
    UpdateUser,
    DeleteUser
  },
  User: {
    created_by: CreatedByLoader,
    updated_by: UpdatedByLoader,
    deleted_by: DeletedByLoader
  }
};
