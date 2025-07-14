// *************** IMPORT LIBRARY ***************
const { mergeResolvers } = require("@graphql-tools/merge");

// *************** IMPORT MODULE ***************
const SchoolResolvers = require("../modules/School/School.resolvers");
const StudentResolvers = require("../modules/Student/Student.resolvers");
const UserResolvers = require("../modules/User/User.resolvers");
const BlockResolvers = require("../modules/Block/Block.resolvers");
const SubjectResolvers = require("../modules/Subject/Subject.resolvers");
const TestResolvers = require("../modules/Test/Test.resolvers");
const TaskResolvers = require("../modules/Task/Task.resolvers");
const StudentTestResultResolvers = require("../modules/StudentTestResult/StudentTestResult.resolvers");

// *************** Combine all Query Resolvers
const Resolvers = mergeResolvers([
  SchoolResolvers,
  StudentResolvers,
  UserResolvers,
  BlockResolvers,
  SubjectResolvers,
  TestResolvers,
  TaskResolvers,
  StudentTestResultResolvers,
]);

// *************** EXPORT MODULE ***************
module.exports = Resolvers;
