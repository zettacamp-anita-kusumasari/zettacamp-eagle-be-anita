// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const studentModel = require('./Student.model.js');

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
  const students = await studentModel.find({ _id: { $in: ids } });
  // *************** Map student ID to school object
  const studentMap = new Map();
  // *************** Store each student in the map with its ID as the key
  for (const student of students) {
    studentMap.set(String(student._id), student);
  }
  // *************** Return students in the same order as input IDs
  return ids.map(id => studentMap.get(String(id)));
}

// *************** Creates a DataLoader instance for students ***************
function CreateStudentLoader() {
  return new DataLoader(BatchStudents);
}

// *************** EXPORT MODULE ***************
module.exports = CreateStudentLoader;
