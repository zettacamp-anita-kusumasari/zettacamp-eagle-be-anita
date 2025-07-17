// *************** IMPORT LIBRARY ***************
const { mergeTypeDefs } = require("@graphql-tools/merge");

// *************** IMPORT MODULE ***************
const SchoolTypeDefs = require("../modules/School/School.typeDefs.js");
const StudentTypeDefs = require("../modules/Student/Student.typeDefs.js");
const UserTypeDefs = require("../modules/User/User.typeDefs.js");
const BlockTypeDefs = require("../modules/Block/Block.typeDefs.js");
const SubjectTypeDefs = require("../modules/Subject/Subject.typeDefs.js");
const TestTypeDefs = require("../modules/Test/Test.typeDefs.js");
const StudentTestResultTypeDefs = require("../modules/StudentTestResult/StudentTestResult.typeDefs.js");
const TaskTypeDefs = require("../modules/Task/Task.typeDefs.js");

// *************** Merge all GraphQL type definitions modules
const TypeDefs = mergeTypeDefs([
  SchoolTypeDefs,
  StudentTypeDefs,
  UserTypeDefs,
  BlockTypeDefs,
  SubjectTypeDefs,
  TestTypeDefs,
  TaskTypeDefs,
  StudentTestResultTypeDefs,
]);

// *************** EXPORT MODULE ***************
module.exports = TypeDefs;
