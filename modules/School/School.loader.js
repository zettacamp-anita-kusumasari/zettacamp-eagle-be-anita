// *************** IMPORT CORE ***************
const DataLoader = require('dataloader');
const database = require('../../core/database');

/**
 * Fetches a list of school data based on given IDs.
 * This function makes sure the result is in the same order as the input IDs.
 * If a school is not found for an ID, it will return `undefined` in that position.
 *
 * This is useful when used with DataLoader to avoid multiple database calls.
 *
 * @async
 * @function batchSchools
 * @param {Array<string|number>} ids - An array of school IDs to look up.
 * @returns {Promise<Array<Object|undefined>>} - A Promise that resolves to an array of school objects.
 * The order matches the input IDs. If a school is not found, the result will include `undefined` for that ID.
 *
 * @example
 * const results = await batchSchools([1, 2, 3]);
 * // Output might look like:
 * // [ { id: 1, name: "School A" }, undefined, { id: 3, name: "School C" } ]
 */
const batchSchools = async (ids) => {
  const schools = await database.getSchoolsByIds(ids);
  const schoolMap = new Map(schools.map(school => [school.id, school]));
  return ids.map(id => schoolMap.get(id));
};

// *************** EXPORT MODULE ***************
module.exports = batchSchools;