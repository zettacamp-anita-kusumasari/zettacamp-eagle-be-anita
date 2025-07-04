// *************** IMPORT MODULE ***************
const SchoolResolvers = require('../modules/School/School.resolvers');
const StudentResolvers = require('../modules/Student/Student.resolvers');
const UserResolvers = require('../modules/User/User.resolvers');
const BlockResolvers = require('../modules/Block/Block.resolvers');
const SubjectResolvers = require('../modules/Subject/Subject.resolvers');
const TestResolvers = require('../modules/Test/Test.resolvers');
const TaskResolvers = require('../modules/Task/Task.resolvers');
const StudentTestResultResolvers = require('../modules/StudentTestResult/StudentTestResult.resolvers');

// *************** Combine all Query resolvers from School, Student, User, Block, and Subject
const Resolvers = {
  Query: {
    // *************** Spread School-related query resolvers (GetAllSchools and GetOneSchool)
    ...SchoolResolvers.Query,
    // *************** Spread Student-related query resolvers (GetAllStudents and GetOneStudent)
    ...StudentResolvers.Query,
    // *************** Spread User-related query resolvers (GetAllUsers and GetOneUser)
    ...UserResolvers.Query,
    // *************** Spread Block-related query resolvers (GetAllBlocks and GetOneBlock)
    ...BlockResolvers.Query,
    // *************** Spread Subject-related query resolvers (GetAllSubjects and GetOneSubject)
    ...SubjectResolvers.Query,
    // *************** Spread Test-related query resolvers (GetAllTests and GetOneTest)
    ...TestResolvers.Query,
    // *************** Spread Student Test Result-related query resolvers (GetAllStudentTestResults and GetOneStudentTestResult)
    ...StudentTestResultResolvers.Query,
    // *************** Spread Task-related query resolvers (GetAllTasks and GetOneTask)
    ...TaskResolvers.Query
  },
  Mutation: {
    // *************** Spread School-related mutation resolvers (CreateSchool, UpdateSchool, and DeleteSchool)
    ...SchoolResolvers.Mutation,
    // *************** Spread Student-related mutation resolvers (CreateStudent, UpdateStudent, and DeleteStudent)
    ...StudentResolvers.Mutation,
    // *************** Spread User-related mutation resolvers (CreateUser, UpdateUser, and DeleteUser)
    ...UserResolvers.Mutation,
    // *************** Spread Block-related mutation resolvers (CreateBlock, UpdateBlock, and DeleteBlock)
    ...BlockResolvers.Mutation,
    // *************** Spread Subject-related mutation resolvers (CreateSubject, UpdateSubject, and DeleteSubject)
    ...SubjectResolvers.Mutation,
    // *************** Spread Test-related mutation resolvers (CreateTest, UpdateTest, and DeleteTest)
    ...TestResolvers.Mutation,
    // *************** Spread Test-related mutation resolvers (CreateTest, UpdateTest, and DeleteTest)
    ...StudentTestResultResolvers.Mutation,
    // *************** Spread Test-related mutation resolvers (CreateTask, UpdateTask, and DeleteTask)
    ...TaskResolvers.Mutation
  },
  // *************** Field-level resolvers for Student type (e.g., school, created_by)
  Student: StudentResolvers.Student,
  // *************** Field-level resolvers for School type (e.g., students, created_by, deleted_by)
  School: SchoolResolvers.School,
};

// *************** EXPORT MODULE ***************
module.exports = Resolvers;