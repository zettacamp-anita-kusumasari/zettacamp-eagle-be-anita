// *************** IMPORT MODULE ***************
const schoolTypeDefs = require('../modules/School/School.typeDefs.js');
const studentTypeDefs = require('../modules/Student/Student.typeDefs.js');
const userTypeDefs = require('../modules/User/User.typeDefs.js');
const blockTypeDefs = require('../modules/Block/Block.typeDefs.js');

// *************** Collects all GraphQL type definitions from School, Student, and User modules
const TypeDefs = [
  schoolTypeDefs,
  studentTypeDefs,
  userTypeDefs,
  blockTypeDefs
];

// *************** EXPORT MODULE ***************
module.exports = TypeDefs;