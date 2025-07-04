// *************** IMPORT MODULE ***************
const schoolTypeDefs = require('../modules/School/School.typeDefs.js');
const studentTypeDefs = require('../modules/Student/Student.typeDefs.js');
const userTypeDefs = require('../modules/User/User.typeDefs.js');
const blockTypeDefs = require('../modules/Block/Block.typeDefs.js');
const subjectTypeDefs = require('../modules/Subject/Subject.typeDefs.js');
const testTypeDefs = require('../modules/Test/Test.typeDefs.js');
const studentTestResultTypeDefs = require('../modules/StudentTestResult/StudentTestResult.typeDefs.js');
const taskTypeDefs = require('../modules/Task/Task.typeDefs.js');

// *************** Collects all GraphQL type definitions modules
const TypeDefs = [
  schoolTypeDefs,
  studentTypeDefs,
  userTypeDefs,
  blockTypeDefs,
  subjectTypeDefs,
  testTypeDefs,
  taskTypeDefs,
  studentTestResultTypeDefs
];

// *************** EXPORT MODULE ***************
module.exports = TypeDefs;