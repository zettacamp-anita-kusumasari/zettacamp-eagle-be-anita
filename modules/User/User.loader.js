// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const userModel = require('./User.model.js');

/**
 * Batch loads a list of users based on an array of user IDs.
 * 
 * This function retrieves users from the database whose `_id` matches any in the `ids` array
 * and returns them in the same order as the input IDs.
 * 
 * @async
 * @function
 * @param {Array<string>} ids - An array of MongoDB ObjectId strings representing user IDs to be fetched.
 * @returns {Promise<Array<Object|undefined>>} A Promise that resolves to an array of user objects
 *   (or `undefined` if not found), in the same order as the input `ids`.
 */
async function BatchUsers(ids) {
  // *************** Fetch users matching the given IDs
  const users = await userModel.find({ _id: { $in: ids } });
  // *************** Map user ID to school object
  const userMap = new Map();
  // *************** Store each user in the map with its ID as the key
  for (const user of users) {
    userMap.set(String(user._id), user);
  }
  // *************** Return users in the same order as input IDs
  return ids.map(id => userMap.get(String(id)));
}

// *************** Creates a DataLoader instance for users ***************
function CreateUserLoader() {
  return new DataLoader(BatchUsers);
}

// *************** EXPORT MODULE ***************
module.exports = CreateUserLoader;
