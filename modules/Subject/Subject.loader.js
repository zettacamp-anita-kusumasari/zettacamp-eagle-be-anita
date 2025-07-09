// *************** IMPORT LIBRARY ***************
const DataLoader = require("dataloader");

// *************** IMPORT MODULE ***************
const SubjectModel = require("./Subject.model.js");

/**
 * Batch function to fetch multiple subjects by their IDs and return them in the same order.
 *
 * @param {Array<string|import("mongoose").Types.ObjectId>} ids - Array of subject IDs to fetch.
 * @returns {Promise<Array<Object|null>>} A promise that resolves to an array of subject objects
 * in the same order as the input IDs. If a subject is not found, null` will be returned in its place.
 */
async function BatchSubjects(ids) {
  // *************** Fetch subjects matching the given IDs
  const subjects = await SubjectModel.find({ _id: { $in: ids } }).lean();
  // *************** Map subject ID to subject object
  const subjectMap = new Map();
  // *************** Store each subject in the map with its ID as the key
  subjects.forEach((subject) => {
    subjectMap.set(String(subject._id), subject);
  });
  // *************** Return subjects in the same order as input IDs
  const toOrderedSubjects = ids.map((id) => subjectMap.get(String(id)) || null);
  return toOrderedSubjects;
}

/**
 * Creates a DataLoader instance for batching and caching Subject document retrieval.
 *
 * @function
 * @returns {import('dataloader')} A DataLoader instance for loading SSubjects by ID.
 */
function CreateSubjectLoader() {
  // *************** Return DataLoader to BatchSubjects
  const toSubjectLoader = new DataLoader(BatchSubjects);
  return toSubjectLoader;
}

// *************** EXPORT MODULE ***************
module.exports = CreateSubjectLoader;
