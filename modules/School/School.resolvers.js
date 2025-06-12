// *************** IMPORT HELPER FUNCTION ***************
const getAllSchools = require('./School.helper');
const getOneSchool = require('./School.helper');
const createSchool = require('./School.helper');
const updateSchool = require('./School.helper');
const deleteSchool = require('./School.helper');
const students = require('./School.helper');

const resolvers = {
  // *************** QUERY ***************
  Query: {
    getAllSchools, getOneSchool
  },

  // *************** MUTATION ***************
  Mutation: {
    createSchool, updateSchool, deleteSchool
  },

  // *************** For resolve the students field for a school
  School: {
    students
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;