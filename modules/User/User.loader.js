// *************** IMPORT CORE ***************
const DataLoader = require('dataloader');
const database = require('../../core/database');

/**
 * Fetches a list of user data based on given IDs.
 * This function makes sure the result is in the same order as the input IDs.
 * If a user is not found for an ID, it will return `undefined` in that position.
 *
 * This is useful when used with DataLoader to avoid multiple database calls.
 *
 * @async
 * @function batchUsers
 * @param {Array<string|number>} ids - An array of school IDs to look up.
 * @returns {Promise<Array<Object|undefined>>} - A Promise that resolves to an array of user objects.
 * The order matches the input IDs. If a student is not found, the result will include `undefined` for that ID.
 *
 * @example
 * const results = await batchUsers([1, 2, 3]);
 * // Output might look like:
 * // [ { id: 1, name: "User A" }, undefined, { id: 3, name: "User C" } ]
 */
const batchUsers = async (ids) => {
  const users = await database.getUsersByIds(ids);
  const userMap = new Map(users.map(user => [user.id, user]));
  return ids.map(id => userMap.get(id));
};

// *************** EXPORT MODULE ***************
module.exports = batchUsers;