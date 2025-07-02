// *************** IMPORT LIBRARY ***************
const DataLoader = require('dataloader');

// *************** IMPORT MODULE ***************
const StudentTestResultModel = require('./StudentTestResult.model.js');

async function BatchStudentTestResults(ids) {
  // *************** Fetch student test results matching the given IDs
  const studentTestResults = await StudentTestResultModel.find({ _id: { $in: ids } });
  // *************** Map student test result ID to student test result object
  const studentTestResultMap = new Map();
  // *************** Store each student test result in the map with its ID as the key
  for (const studentTestResult of studentTestResults) {
    studentTestResultMap.set(String(studentTestResult._id), studentTestResult);
  }
  // *************** Return student test results in the same order as input IDs
  const toOrderedStudentTestResults = ids.map(id => studentTestResultMap.get(String(id)));
  return toOrderedStudentTestResults;
}

function CreateStudentTestResultLoader() {
  // *************** Return DataLoader to BatchStudentTestResults
  const toStudentTestResultLoader = new DataLoader(BatchStudentTestResults);
  return toStudentTestResultLoader;
}

// *************** EXPORT MODULE ***************
module.exports = CreateStudentTestResultLoader;
