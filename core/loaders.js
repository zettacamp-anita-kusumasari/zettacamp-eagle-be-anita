// *************** IMPORT MODULE ***************
const createSchoolLoader = require("../modules/School/School.loader.js");
const createUserLoader = require("../modules/User/User.loader.js");
const createStudentLoader = require("../modules/Student/Student.loader.js");
const createBlockLoader = require("../modules/Block/Block.loader.js");
const createSubjectLoader = require("../modules/Subject/Subject.loader.js");
const createTestLoader = require("../modules/Test/Test.loader.js");
const createTaskLoader = require("../modules/Task/Task.loader.js");
const createStudentTestResultLoader = require("../modules/StudentTestResult/StudentTestResult.loader.js");

/**
 * Creates and returns an object containing all DataLoaders for batching and caching database requests.
 *
 * @function createLoaders
 * @returns {Object} An object with DataLoaders for schools, users, and students:
 * @returns {DataLoader} return.schoolLoader - Batches and caches school data requests
 * @returns {DataLoader} return.userLoader - Batches and caches user data requests
 * @returns {DataLoader} return.studentLoader - Batches and caches student data requests
 */
function Loaders() {
  // *************** Returns an object containing all DataLoaders
  return {
    schoolLoader: createSchoolLoader(),
    userLoader: createUserLoader(),
    studentLoader: createStudentLoader(),
    blockLoader: createBlockLoader(),
    subjectLoader: createSubjectLoader(),
    testLoader: createTestLoader(),
    taskLoader: createTaskLoader(),
    studentTestResult: createStudentTestResultLoader(),
  };
}

// *************** EXPORT MODULE ***************
module.exports = Loaders;
