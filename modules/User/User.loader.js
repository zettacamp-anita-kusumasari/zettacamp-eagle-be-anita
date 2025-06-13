// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const UserModel = require('./User.model.js');

// *************** IMPORT VALIDATOR ***************
const validateUser = require('./User.validator.js');

/**
 * Batch loads and validates a list of users based on an array of user IDs.
 * 
 * This function queries the database for user documents whose `_id` is included in the `ids` array.
 * Each user is converted to a plain JavaScript object and validated using `validateUser`.
 * The function returns an array of validated user objects (or `undefined` if validation fails),
 * preserving the original order of the input IDs.
 * 
 * @async
 * @function
 * @param {Array<string>} ids - An array of MongoDB ObjectId strings representing user IDs to be fetched and validated.
 * @returns {Promise<Array<Object|undefined>>} A Promise that resolves to an array of validated user objects,
 *   or `undefined` for any user that failed validation or was not found, in the same order as the input `ids`.
 */
async function batchUsers(ids) {
  // *************** Fetch all user documents from the database where _id is in the provided ids array
  const users = await UserModel.find({ _id: { $in: ids } });
  // *************** Map from ID to validated user
  const userMap = new Map();
  // *************** Iterate over each retrieved user document
  for (const user of users) {
    try {
      // *************** Convert the Mongoose document to a plain JavaScript object and validate it
      const validated = validateUser(user.toObject());
      // *************** Store the validated user object in the map, keyed by the user's ID as a string
      userMap.set(String(user._id), validated);
    } catch (error) {
      // *************** If validation fails, log an error message with the user ID
      console.error(`Validation failed for user ${user._id}:`, error.message);
      // *************** Store undefined for users that failed validation to preserve the result order
      userMap.set(String(user._id), undefined);
    }
  }
  // ************** Return an array of validated users (or undefined), ordered to match the input ids
  return ids.map(id => userMap.get(String(id)));
}

// *************** Creates a DataLoader instance for users
function createUserLoader() {
  return new DataLoader(batchUsers);
}

// *************** EXPORT MODULE ***************
module.exports = createUserLoader;
