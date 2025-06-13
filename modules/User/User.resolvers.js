// *************** IMPORT CORE ***************
const UserModel = require('./User.model');

// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server-express');
const mongoose = require('mongoose');

// *************** IMPORT VALIDATOR ***************
const validateUser = require('./User.validator');

// *************** QUERY ***************
/**
 * Retrieves all user documents from the database.
 *
 * This function is typically used in a GraphQL query resolver to fetch
 * a complete list of users stored in the system.
 *
 * @async
 * @function GetAllUsers
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of user documents.
 * @throws {ApolloError} - Throws an ApolloError if the database query fails.
 */
async function GetAllUsers() {
  try {
    // *************** Define an asynchronous function to retrieve all users from the database
    return await UserModel.find();
  } catch (error) {
    // *************** If an error occurs during the fetch, throw a formatted ApolloError for GraphQL error handling
    throw new ApolloError(`Failed to fetch users: ${error.message}`, "INTERNAL_SERVER_ERROR");
  }
}

/**
 * Retrieves a single user by their ID using DataLoader for optimized access.
 *
 * This function is used in a GraphQL query resolver to fetch one user based on the provided ID.
 * It first validates the ID format using Mongoose's ObjectId check.
 * If the ID is valid, it attempts to load the user from the DataLoader.
 * Throws appropriate ApolloErrors if the ID is invalid, the user is not found, or another error occurs.
 *
 * @async
 * @function GetOneUser
 * @param {Object} _ - Unused GraphQL parent argument placeholder.
 * @param {Object} args - The arguments passed to the resolver.
 * @param {string} args.id - The ID of the user to retrieve.
 * @param {Object} context - The GraphQL context containing the DataLoader instance (`userLoader`).
 * @returns {Promise<Object>} - The user document corresponding to the given ID.
 * @throws {ApolloError} - Throws if the ID is invalid, user is not found, or the fetch fails.
 */
async function GetOneUser(_, { id }, context) {
  // *************** If invalid, throw an ApolloError with a 'BAD USER INPUT' code
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }
  try {
    // *************** Use DataLoader to fetch the user with the given ID from the database
    const user = await context.userLoader.load(id);
    // *************** If no user is found with that ID, throw a 'NOT FOUND' error
    if (!user) {
      throw new ApolloError("User not found", "NOT_FOUND");
    }
    return user;
  } catch (error) {
    // *************** If any error occurs during the fetch, catch it and throw a formatted ApolloError
    throw new ApolloError(`Failed to fetch user: ${error.message}`, "INTERNAL_SERVER_ERROR");
  }
}

// *************** MUTATION ***************
/**
 * Creates a new user in the database after validating the input.
 *
 * This function is typically used in a GraphQL mutation resolver to handle user creation.
 * It validates the incoming input using a `validateUser` function (e.g., Joi schema),
 * then constructs a new `UserModel` instance and saves it to the database.
 * If any step fails (validation or saving), an ApolloError is thrown.
 *
 * @async
 * @function CreateUser
 * @param {Object} _ - Unused GraphQL parent argument placeholder.
 * @param {Object} args - The arguments object from GraphQL.
 * @param {Object} args.input - The input object containing user data to be validated and saved.
 * @returns {Promise<Object>} - The newly created user document.
 * @throws {ApolloError} - Throws if validation fails or the user cannot be saved to the database.
 */
async function CreateUser(_, { input }) {
  try {
    // *************** Validate the input object using a custom validation function
    const validatedInput = validateUser(input);
    // *************** Create a new Mongoose user instance using the validated input data
    const newUser = new UserModel(validatedInput);
    // *************** Save the new user to the database and return the saved document
    return await newUser.save();
  } catch (error) {
    // *************** If validation or saving fails, throw an ApolloError with a specific error code
    throw new ApolloError(`Failed to create user: ${error.message}`, 'USER_CREATION_FAILED');
  }
}

/**
 * Updates an existing user document in the database by ID.
 *
 * This function is typically used in a GraphQL mutation resolver to handle user updates.
 * It first validates the provided `id` to ensure it's a valid MongoDB ObjectId.
 * Then it validates the input using `validateUser`, updates the `updated_at` timestamp,
 * and attempts to find and update the user using Mongoose's `findByIdAndUpdate`.
 * If the user is not found or an error occurs, an appropriate ApolloError is thrown.
 *
 * @async
 * @function UpdateUser
 * @param {Object} _ - Unused GraphQL parent argument placeholder.
 * @param {Object} args - The arguments passed to the resolver.
 * @param {string} args.id - The ID of the user to update.
 * @param {Object} args.input - The input object containing fields to update.
 * @returns {Promise<Object>} - The updated user document.
 * @throws {ApolloError} - Throws if the ID is invalid, the user is not found, or the update operation fails.
 */
async function UpdateUser(_, { id, input }) {
  // *************** Validate if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }
  try {
    // *************** Validate the input data using a custom function (e.g., Joi schema)
    const validatedInput = validateUser(input);
    // *************** Add a timestamp to mark when the user was last updated
    validatedInput.updated_at = Date.now();
    // *************** Attempt to find the user by ID and update their data in the database
    const updatedUser = await UserModel.findByIdAndUpdate(id, validatedInput, { new: true });
    // *************** If no user is found with the given ID, throw a "NOT FOUND" error
    if (!updatedUser) {
      throw new ApolloError("User not found", "NOT_FOUND");
    }
    // *************** If successful, return the updated user document
    return updatedUser;
  } catch (error) {
    // *************** If any error occurs during the process, wrap and throw it as an ApolloError
    throw new ApolloError(`Failed to update user: ${error.message}`, 'USER_UPDATE_FAILED');
  }
}

/**
 * Deletes a user from the database by their ID.
 *
 * This function is used in a GraphQL mutation resolver to remove a user document.
 * It first validates the provided ID to ensure it is a valid MongoDB ObjectId.
 * If valid, it attempts to delete the user using `findByIdAndDelete`.
 * If the user does not exist or an error occurs, an appropriate `ApolloError` is thrown.
 *
 * @async
 * @function DeleteUser
 * @param {Object} _ - Unused GraphQL parent argument placeholder.
 * @param {Object} args - The arguments passed to the resolver.
 * @param {string} args.id - The ID of the user to delete.
 * @returns {Promise<Object>} - The deleted user document.
 * @throws {ApolloError} - Throws if the ID is invalid, the user is not found, or deletion fails.
 */
async function DeleteUser(_, { id }) {
  // *************** Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }
  try {
    // *************** Attempt to find and delete the user with the specified ID from the database
    const deletedUser = await UserModel.findByIdAndDelete(id);
    // *************** If no user is found with the given ID, throw a "NOT FOUND" error
    if (!deletedUser) {
      throw new ApolloError("User not found", "NOT_FOUND");
    }
    // *************** If successful, return the deleted user document
    return deletedUser;
  } catch (error) {
    // *************** If any error occurs during the operation, throw an ApolloError with a specific failure message
    throw new ApolloError(`Failed to delete user: ${error.message}`, 'USER_DELETION_FAILED');
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  Query: { GetAllUsers, GetOneUser },
  Mutation: { CreateUser, UpdateUser, DeleteUser },
};
