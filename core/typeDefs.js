// *************** IMPORT MODULE ***************
const schoolTypeDefs = require('../modules/School/School.typeDefs.js');
const studentTypeDefs = require('../modules/Student/Student.typeDefs.js');
const userTypeDefs = require('../modules/User/User.typeDefs.js');
const blockTypeDefs = require('../modules/Block/Block.typeDefs.js');
const subjectTypeDefs = require('../modules/Subject/Subject.typeDefs.js');
const testTypeDefs = require('../modules/Test/Test.typeDefs.js');

// *************** Collects all GraphQL type definitions from School, Student, User, Block, Subject, and Test modules
const TypeDefs = [
  schoolTypeDefs,
  studentTypeDefs,
  userTypeDefs,
  blockTypeDefs,
  subjectTypeDefs,
  testTypeDefs
];

// *************** EXPORT MODULE ***************
module.exports = TypeDefs;