// *************** IMPORT CORE ***************
const database = require('../../core/database');

// *************** IMPORT VALIDATOR ***************
const { validateUser } = require('./User.validator');

// *************** LOADER ***************
const DataLoader = require('dataloader');

/**
 * Batches and retrieves user data by an array of IDs, validates each user,
 * and returns them in the same order as the input IDs.
 *
 * For each user:
 * - Fetches the user from the database.
 * - Validates the user using `validateUser`.
 * - Logs an error and assigns `undefined` if validation fails.
 *
 * @async
 * @function batchUsers
 * @param {Array<string|number>} ids - An array of user IDs to fetch.
 * @returns {Promise<Array<Object|undefined>>} A promise that resolves to an array of validated user objects.
 * The order of the array matches the input `ids`. If a user's data is invalid, `undefined` is returned for that ID.
 */
const batchUsers = async (ids) => {
  const users = await database.getUsersByIds(ids);
  const userMap = new Map(users.map(user => {
    try {
      return [user.id, validateStudent(user)];
    } catch (err) {
      console.error(`Invalid user data: ${err.message}`);
      return [user.id, undefined];
    }
  }));
  return ids.map(id => userMap.get(id));
};

// *************** EXPORT MODULE ***************
module.exports = batchUsers;