// *************** IMPORT CORE ***************
const DataLoader = require('dataloader');
const db = require('../../core/database');

// *************** For User data load
const batchSchools = async (ids) => {
  const schools = await db.getUsersByIds(ids);
  const schoolMap = new Map(schools.map(school => [school.id, school]));
  return ids.map(id => schoolMap.get(id));
};

// *************** EXPORT MODULE ***************
module.exports = batchSchools;