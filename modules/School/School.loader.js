// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const SchoolModel = require('./School.model.js');

/**
 * Batch loads a list of schools based on an array of school IDs.
 * 
 * This function retrieves schools from the database whose `_id` matches any in the `ids` array
 * and returns them in the same order as the input IDs.
 * 
 * @async
 * @function
 * @param {Array<string>} ids - An array of MongoDB ObjectId strings representing school IDs to be fetched.
 * @returns {Promise<Array<Object|undefined>>} A Promise that resolves to an array of school objects
 *   (or `undefined` if not found), in the same order as the input `ids`.
 */
async function BatchSchools(ids) {
  // *************** Fetch schools matching the given IDs
  const schools = await SchoolModel.find({ _id: { $in: ids } });
  // *************** Map school ID to school object
  const schoolMap = new Map();
  // *************** Store each school in the map with its ID as the key
  for (const school of schools) {
    schoolMap.set(String(school._id), school);
  }
  // *************** Return schools in the same order as input IDs
  return ids.map(id => schoolMap.get(String(id)));
}

/**
 * Creates a new instance of DataLoader for batching and caching school data fetching.
 *
 * @function
 * @returns {DataLoader<string, School>} A DataLoader instance that batches and caches school retrieval by ID.
 */
function CreateSchoolLoader() {
  // *************** Return DataLoader to BatchSchools 
  return new DataLoader(BatchSchools);
}

// *************** EXPORT MODULE ***************
module.exports = CreateSchoolLoader;
