// *************** IMPORT LIBRARY ***************
const DataLoader = require("dataloader");

// *************** IMPORT MODULE ***************
const StudentTestResultModel = require("./StudentTestResult.model.js");

/**
 * Batch function to fetch student test results by their IDs.
 *
 * @param {Array<string | import("mongoose").Types.ObjectId>} ids - List of student test result IDs.
 * @returns {Promise<Array<Object|null>>} A promise resolving to an array of student test results,
 * matched by order of input IDs. If an ID is not found, `null` is returned in its place.
 */
async function BatchStudentTestResults(ids) {
  // *************** Fetch student test results matching the given IDs
  const studentTestResults = await StudentTestResultModel.find({
    _id: { $in: ids },
  }).lean();
  // *************** Map student test result ID to student test result object
  const studentTestResultMap = new Map();
  // *************** Store each student test result in the map with its ID as the key
  studentTestResults.forEach((studentTestResult) => {
    studentTestResultMap.set(String(studentTestResult._id), studentTestResult);
  });
  // *************** Return student test results in the same order as input IDs
  const toOrderedStudentTestResults = ids.map((id) =>
    studentTestResultMap.get(String(id) || null)
  );
  return toOrderedStudentTestResults;
}

/**
 * Creates a DataLoader instance for batching and caching Student Test Result document retrieval.
 *
 * @function
 * @returns {import('dataloader')} A DataLoader instance for loading Student Test Results by ID.
 */
function CreateStudentTestResultLoader() {
  // *************** Return DataLoader to BatchStudentTestResults
  const toStudentTestResultLoader = new DataLoader(BatchStudentTestResults);
  return toStudentTestResultLoader;
}

// *************** EXPORT MODULE ***************
module.exports = CreateStudentTestResultLoader;
