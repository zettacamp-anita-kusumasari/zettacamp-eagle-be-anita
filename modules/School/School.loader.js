// *************** IMPORT CORE ***************
const database = require('../../core/database');

// *************** IMPORT VALIDATOR ***************
const { validateSchool } = require('./School.validator.js');

// *************** LOADER ***************
const DataLoader = require('dataloader');

/**
 * Batches and retrieves school data by an array of IDs, validates each school,
 * and maps the result in the same order as the input IDs.
 *
 * @param {Array<string|number>} ids - An array of school IDs to fetch.
 * @returns {Promise<Array<Object|undefined>>} A promise that resolves to an array of validated school objects,
 * in the same order as the input IDs. If validation fails for a school, `undefined` is returned for that ID.
 */
const batchSchools = async (ids) => {
  const schools = await database.getSchoolsByIds(ids);
  const schoolMap = new Map(schools.map(school => {
    try {
      return [school.id, validateSchool(school)];
    } catch (err) {
      console.error(`Invalid school data: ${err.message}`);
      return [school.id, undefined];
    }
  }));
  return ids.map(id => schoolMap.get(id));
};

// *************** EXPORT MODULE ***************
module.exports = batchSchools;