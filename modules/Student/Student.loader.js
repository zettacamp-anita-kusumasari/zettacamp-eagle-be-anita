// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const StudentModel = require('./Student.model.js');

// *************** IMPORT VALIDATOR ***************
const validateStudent = require('./Student.validator.js');

/**
 * Batch loads and validates a list of students based on an array of student IDs.
 * 
 * This function queries the database for student documents whose `_id` is in the provided `ids` array.
 * Each student is converted to a plain object and validated using `validateStudent`.
 * The function returns an array of validated student objects (or `undefined` if validation fails or the student is not found),
 * preserving the same order as the input `ids`.
 * 
 * @async
 * @function
 * @param {Array<string>} ids - An array of student ID strings (MongoDB ObjectId format) to be fetched and validated.
 * @returns {Promise<Array<Object|undefined>>} A promise that resolves to an array of validated student objects,
 *   or `undefined` for entries that failed validation or were not found, in the same order as the input IDs.
 */
async function batchStudents(ids) {
  // Fetch all student documents from the database where _id is in the input ids array
  const students = await StudentModel.find({ _id: { $in: ids } });
  // *************** Map from ID to validated student
  const studentMap = new Map();
  // *************** Iterate over each retrieved student document
  for (const student of students) {
    try {
      // *************** Convert the Mongoose document into a plain JavaScript object and validate it
      const validated = validateStudent(student.toObject());
      // *************** Store the validated student in the map using the ID as the key
      studentMap.set(String(student._id), validated);
    } catch (error) {
      // *************** If validation fails, log the error message for debugging
      console.error(`Validation failed for student ${student._id}:`, error.message);
      // *************** Store undefined for the student to preserve index alignment with input IDs
      studentMap.set(String(student._id), undefined);
    }
  }
  // Return an array of validated students or undefined, ordered to match the input IDs
  return ids.map(id => studentMap.get(String(id)));
}

// *************** Creates a DataLoader instance for users
function createStudentLoader() {
  return new DataLoader(batchStudents);
}

// *************** EXPORT MODULE ***************
module.exports = createStudentLoader;
