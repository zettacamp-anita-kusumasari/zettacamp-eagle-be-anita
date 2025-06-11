// *************** IMPORT CORE ***************
const DataLoader = require('dataloader');
const db = require('../../core/database');

/**
 * Fetches a list of school data based on given IDs.
 * This function makes sure the result is in the same order as the input IDs.
 * If a student is not found for an ID, it will return `undefined` in that position.
 *
 * This is useful when used with DataLoader to avoid multiple database calls.
 *
 * @async
 * @function batchStudents
 * @param {Array<string|number>} ids - An array of school IDs to look up.
 * @returns {Promise<Array<Object|undefined>>} - A Promise that resolves to an array of school objects.
 * The order matches the input IDs. If a student is not found, the result will include `undefined` for that ID.
 *
 * @example
 * const results = await batchStudents([1, 2, 3]);
 * // Output might look like:
 * // [ { id: 1, name: "Student A" }, undefined, { id: 3, name: "Student C" } ]
 */
const batchStudents = async (ids) => {
  const students = await db.getStudentsByIds(ids);
  const studentMap = new Map(students.map(student => [student.id, student]));
  return ids.map(id => studentMap.get(id));
};

// *************** EXPORT MODULE ***************
module.exports = batchStudents;