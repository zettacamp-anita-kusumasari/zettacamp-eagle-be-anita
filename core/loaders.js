// *************** IMPORT MODULE ***************
const createSchoolLoader = require('../modules/School/School.loader.js');
const createUserLoader = require('../modules/User/User.loader.js');
const createStudentLoader = require('../modules/Student/Student.loader.js');

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
  };
}

// *************** EXPORT MODULE ***************
module.exports = Loaders;