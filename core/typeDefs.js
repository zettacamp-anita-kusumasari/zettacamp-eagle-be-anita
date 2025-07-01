// *************** IMPORT MODULE ***************
const schoolTypeDefs = require('../modules/School/School.typeDefs.js');
const studentTypeDefs = require('../modules/Student/Student.typeDefs.js');
const userTypeDefs = require('../modules/User/User.typeDefs.js');
const blockTypeDefs = require('../modules/Block/Block.typeDefs.js');
const subjectTypeDefs = require('../modules/Subject/Subject.typeDefs.js');

// *************** Collects all GraphQL type definitions from School, Student, User, Block, and Subject modules
const TypeDefs = [
  schoolTypeDefs,
  studentTypeDefs,
  userTypeDefs,
  blockTypeDefs,
  subjectTypeDefs
];

// *************** EXPORT MODULE ***************
module.exports = TypeDefs;