// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const StudentModel = require('./Student.model.js');

/**
 * Batch loads a list of students based on an array of student IDs.
 * 
 * This function retrieves students from the database whose `_id` matches any in the `ids` array
 * and returns them in the same order as the input IDs.
 * 
 * @async
 * @function
 * @param {Array<string>} ids - An array of MongoDB ObjectId strings representing student IDs to be fetched.
 * @returns {Promise<Array<Object|undefined>>} A Promise that resolves to an array of student objects
 *   (or `undefined` if not found), in the same order as the input `ids`.
 */
async function BatchStudents(ids) {
  // *************** Fetch students matching the given IDs
  const students = await StudentModel.find({ _id: { $in: ids } });
  // *************** Map student ID to school object
  const studentMap = new Map();
  // *************** Store each student in the map with its ID as the key
  for (const student of students) {
    studentMap.set(String(student._id), student);
  }
  // *************** Return students in the same order as input IDs
  const toSameOrderInput = ids.map(id => studentMap.get(String(id)));
  return toSameOrderInput;
}

/**
 * Creates a new instance of DataLoader for batching and caching student data fetching.
 *
 * @function
 * @returns {DataLoader<string, School>} A DataLoader instance that batches and caches student retrieval by ID.
 */
function CreateStudentLoader() {
  // *************** Return DataLoader to BatchStudents
  const toBatchStudents = new DataLoader(BatchStudents);
  return toBatchStudents;
}

// *************** EXPORT MODULE ***************
module.exports = CreateStudentLoader;
