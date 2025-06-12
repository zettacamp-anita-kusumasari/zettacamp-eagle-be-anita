// *************** IMPORT HELPER FUNCTION ***************
const getAllStudents = require('./Student.helper.js');
const getOneStudent = require('./Student.helper.js');
const createStudent = require('./Student.helper.js');
const updateStudent = require('./Student.helper.js');
const deleteStudent = require('./Student.helper.js');
const school = require('./Student.helper.js');

const resolvers = {
  // *************** QUERY ***************
  Query: {
    getAllStudents, getOneStudent
  },
  
  // *************** MUTATION ***************
  Mutation: {
    createStudent, updateStudent, deleteStudent
  },

  // *************** For resolve the school field for a student
  Student: {
    school
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;