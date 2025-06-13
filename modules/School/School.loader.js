// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const SchoolModel = require('./School.model.js');

// *************** IMPORT VALIDATOR ***************
const validateSchool = require('./School.validator.js');

/**
 * Batch loads and validates a list of schools based on an array of school IDs.
 * 
 * This function retrieves schools from the database whose `_id` matches any in the `ids` array.
 * Each school is validated using `validateSchool`, and the results are returned in the same order as the input IDs.
 * If validation fails for a specific school, `undefined` is returned in its place.
 * 
 * @async
 * @function
 * @param {Array<string>} ids - An array of MongoDB ObjectId strings representing school IDs to be fetched.
 * @returns {Promise<Array<Object|undefined>>} A Promise that resolves to an array of validated school objects
 *   (or `undefined` for entries that failed validation), in the same order as the input `ids`.
 */
async function batchSchools(ids) {
  // *************** Fetch all schools from the database whose IDs are in the input array
  const schools = await SchoolModel.find({ _id: { $in: ids } });
  // *************** Map from ID to validated school
  const schoolMap = new Map();
  // *************** Iterate through each retrieved school document
  for (const school of schools) {
    try {
      // *************** Convert Mongoose document to plain object and validate it
      const validated = validateSchool(school.toObject());
      // *************** Store the validated school in the map using its ID as the key
      schoolMap.set(String(school._id), validated);
    } catch (error) {
      // *************** Log an error if validation fails
      console.error(`Validation failed for school ${school._id}:`, error.message);
      // *************** Store undefined for failed validations to preserve order
      schoolMap.set(String(school._id), undefined);
    }
  }
  // Return the results in the same order as the input IDs
  return ids.map(id => schoolMap.get(String(id)));
}

// *************** Creates a DataLoader instance for schools
function createSchoolLoader() {
  return new DataLoader(batchSchools);
}

// *************** EXPORT MODULE ***************
module.exports = createSchoolLoader;
