// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const SubjectModel = require('./Subject.model.js');

async function BatchSubjects(ids) {
  // *************** Fetch subjects matching the given IDs
  const subjects = await SubjectModel.find({ _id: { $in: ids } });
  // *************** Map subject ID to subject object
  const subjectMap = new Map();
  // *************** Store each subject in the map with its ID as the key
  for (const subject of subjects) {
    subjectMap.set(String(subject._id), subject);
  }
  // *************** Return subjects in the same order as input IDs
  const toOrderedSubjects = ids.map(id => subjectMap.get(String(id)));
  return toOrderedSubjects;
}

function CreateSubjectLoader() {
  // *************** Return DataLoader to BatchSchools
  const toSubjectLoader = new DataLoader(BatchSubjects);
  return toSubjectLoader;
}

// *************** EXPORT MODULE ***************
module.exports = CreateSubjectLoader;
