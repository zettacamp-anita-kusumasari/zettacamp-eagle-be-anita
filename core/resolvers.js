// *************** IMPORT MODULE ***************
const SchoolResolvers = require('../modules/School/School.resolvers');
const StudentResolvers = require('../modules/Student/Student.resolvers');
const UserResolvers = require('../modules/User/User.resolvers');

// *************** Root resolver object that merges queries, mutations, and nested resolvers from all modules
const Resolvers = {
  Query: {
    ...SchoolResolvers.Query,
    ...StudentResolvers.Query,
    ...UserResolvers.Query
  },
  Mutation: {
    ...SchoolResolvers.Mutation,
    ...StudentResolvers.Mutation,
    ...UserResolvers.Mutation
  },
  Student: StudentResolvers.Student,
  School: SchoolResolvers.School,
};

// *************** EXPORT MODULE ***************
module.exports = Resolvers;