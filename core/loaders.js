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
 * Initializes and returns an object containing all DataLoaders used for batching and caching 
 * database queries in the GraphQL context.
 *
 * @function Loaders
 * @returns {Object} An object containing initialized DataLoaders.
 * @returns {DataLoader} return.schoolLoader - DataLoader for school data
 * @returns {DataLoader} return.userLoader - DataLoader for user data
 * @returns {DataLoader} return.studentLoader - DataLoader for student data
 * @returns {DataLoader} return.blockLoader - DataLoader for block data
 * @returns {DataLoader} return.subjectLoader - DataLoader for subject data
 * @returns {DataLoader} return.testLoader - DataLoader for test data
 * @returns {DataLoader} return.taskLoader - DataLoader for task data
 * @returns {DataLoader} return.studentTestResult - DataLoader for student test results
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
