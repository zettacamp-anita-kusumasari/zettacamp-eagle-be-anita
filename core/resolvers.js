// *************** IMPORT MODULE ***************
const SchoolResolvers = require('../modules/School/School.resolvers');
const StudentResolvers = require('../modules/Student/Student.resolvers');
const UserResolvers = require('../modules/User/User.resolvers');
const BlockResolvers = require('../modules/Block/Block.resolvers');

// *************** Combine all Query resolvers from School, Student, and User
const Resolvers = {
  Query: {
    // *************** Spread School-related query resolvers (GetAllSchools and GetOneSchool)
    ...SchoolResolvers.Query,
    // *************** Spread Student-related query resolvers (GetAllStudents and GetOneStudent)
    ...StudentResolvers.Query,
    // *************** Spread User-related query resolvers (GetAllUsers and GetOneUser)
    ...UserResolvers.Query,
    // *************** Spread Block-related query resolvers (GetAllBlocks and GetOneBlock)
    ...BlockResolvers.Query
  },
  Mutation: {
    // *************** Spread School-related mutation resolvers (CreateSchool, UpdateSchool, and DeleteSchool)
    ...SchoolResolvers.Mutation,
    // *************** Spread Student-related mutation resolvers (CreateStudent, UpdateStudent, and DeleteStudent)
    ...StudentResolvers.Mutation,
    // *************** Spread User-related mutation resolvers (CreateUser, UpdateUser, and DeleteUser)
    ...UserResolvers.Mutation,
    // *************** Spread Block-related mutation resolvers (CreateBlock, UpdateBlock, and DeleteBlock)
    ...BlockResolvers.Mutation
  },
  // *************** Field-level resolvers for Student type (e.g., school, created_by)
  Student: StudentResolvers.Student,
  // *************** Field-level resolvers for School type (e.g., students, created_by, deleted_by)
  School: SchoolResolvers.School,
};

// *************** EXPORT MODULE ***************
module.exports = Resolvers;