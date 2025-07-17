// *************** IMPORT MODULE ***************
const CreateSchoolLoader = require("../modules/School/School.loader.js");
const CreateUserLoader = require("../modules/User/User.loader.js");
const CreateStudentLoader = require("../modules/Student/Student.loader.js");
const CreateBlockLoader = require("../modules/Block/Block.loader.js");
const CreateSubjectLoader = require("../modules/Subject/Subject.loader.js");
const CreateTestLoader = require("../modules/Test/Test.loader.js");
const CreateTaskLoader = require("../modules/Task/Task.loader.js");
const CreateStudentTestResultLoader = require("../modules/StudentTestResult/StudentTestResult.loader.js");

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
    schoolLoader: CreateSchoolLoader(),
    userLoader: CreateUserLoader(),
    studentLoader: CreateStudentLoader(),
    blockLoader: CreateBlockLoader(),
    subjectLoader: CreateSubjectLoader(),
    testLoader: CreateTestLoader(),
    taskLoader: CreateTaskLoader(),
    studentTestResult: CreateStudentTestResultLoader(),
  };
}

// *************** EXPORT MODULE ***************
module.exports = Loaders;
