// *************** IMPORT CORE ***************
const database = require('../../core/database');

// *************** IMPORT VALIDATOR ***************
const { validateStudent } = require('./Student.validator.js');

// *************** LOADER ***************
const DataLoader = require('dataloader');

/**
 * Batches and retrieves student data by an array of IDs, validates each student,
 * and returns them in the same order as the input IDs.
 *
 * For each student, the function:
 * - Fetches the student from the database.
 * - Validates the student using `validateStudent`.
 * - Logs an error and returns `undefined` if validation fails.
 *
 * @async
 * @function batchStudents
 * @param {Array<string|number>} ids - An array of student IDs to fetch.
 * @returns {Promise<Array<Object|undefined>>} A promise that resolves to an array of validated student objects.
 * The order of the array matches the input `ids`. If a student's data is invalid, `undefined` is returned for that ID.
 */
const batchStudents = async (ids) => {
  const students = await database.getStudentsByIds(ids);
  const studentMap = new Map(students.map(student => {
    try {
      return [student.id, validateStudent(student)];
    } catch (err) {
      console.error(`Invalid student data: ${err.message}`);
      return [student.id, undefined];
    }
  }));
  return ids.map(id => studentMap.get(id));
};

// *************** EXPORT MODULE ***************
module.exports = batchStudents;