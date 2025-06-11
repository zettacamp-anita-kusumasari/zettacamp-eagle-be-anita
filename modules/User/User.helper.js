// *************** IMPORT CORE ***************
const User = require('./User.model.js');

/**
 * Retrieves all users from the database.
 *
 * @async
 * @function getAllUsers
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects.
 * @throws {Error} Throws an error if there is a problem fetching the users.
 */
async function getAllUsers() {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Retrieves a single user by their ID.
 *
 * @async
 * @function getOneUser
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The ID of the user to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the user object if found, or null if not found.
 * @throws {Error} Throws an error if there is a problem fetching the user.
 */
async function getOneUser(_, { id }) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Creates a new user using the provided arguments.
 *
 * @async
 * @function createUser
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} args - The arguments containing user data (e.g., name, email, password, etc.).
 * @returns {Promise<Object>} A promise that resolves to the newly created user object.
 * @throws {Error} Throws an error if the user creation fails.
 */
async function createUser (_, args) {
  try {
    const user = new User(args);
    return await user.save();
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

/**
 * Updates an existing user by their ID with the provided update fields.
 *
 * @async
 * @function updateUser
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The ID of the user to update.
 * @param {Object} params.updates - An object containing the fields to update in the user document.
 * @returns {Promise<Object>} A promise that resolves to the updated user object.
 * @throws {Error} Throws an error if the user is not found or if the update operation fails.
 */
async function updateUser(_, { id, ...updates }) {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

/**
 * Soft deletes a user by setting the `deletedAt` timestamp.
 *
 * @async
 * @function deleteUser
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The ID of the user to be soft deleted.
 * @returns {Promise<Object>} A promise that resolves to the updated (soft-deleted) user object.
 * @throws {Error} Throws an error if the user is not found or the delete operation fails.
 */
async function deleteUser(_, { id }) {
  try {
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

// *************** EXPORT MODULE ***************
module.exports = getAllUsers, getOneUser, createUser, updateUser, deleteUser;