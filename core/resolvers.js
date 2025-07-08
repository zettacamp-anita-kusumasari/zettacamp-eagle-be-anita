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
const Resolvers = {
  Query: {
    ...SchoolResolvers.Query,
    ...StudentResolvers.Query,
    ...UserResolvers.Query,
    ...BlockResolvers.Query,
    ...SubjectResolvers.Query,
    ...TestResolvers.Query,
    ...StudentTestResultResolvers.Query,
    ...TaskResolvers.Query,
  },
  // *************** Spread All Mutation Resolvers
  Mutation: {
    ...SchoolResolvers.Mutation,
    ...StudentResolvers.Mutation,
    ...UserResolvers.Mutation,
    ...BlockResolvers.Mutation,
    ...SubjectResolvers.Mutation,
    ...TestResolvers.Mutation,
    ...StudentTestResultResolvers.Mutation,
    ...TaskResolvers.Mutation,
  },
  // *************** Field-level resolvers for Student type (e.g., school, created_by)
  Student: StudentResolvers.Student,
  // *************** Field-level resolvers for School type (e.g., students, created_by, deleted_by)
  School: SchoolResolvers.School,
};

// *************** EXPORT MODULE ***************
module.exports = Resolvers;
