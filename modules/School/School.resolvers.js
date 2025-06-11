// *************** IMPORT CORE ***************
const School = require('./School.model');

const resolvers = {
  Query: {
    // *************** To fetch all the schools
    GetAllSchools: async () => await School.find({}),

    // *************** To fetch a single school by ID
    GetOneSchool: async (_, { id }) => await School.findById(id),
  },

  Mutation: {
    // *************** Create a new school with provided args (arguments | parameters)
    createSchool: async (_, args) => {
      const school = new School(args);
      return await school.save();
    },

    // *************** Update school by ID, returning the updated document
    updateSchool: async (_, { id, ...updates }) => {
      return await School.findByIdAndUpdate(id, updates, { new: true });
    },

    // *************** Soft delete a school by setting deletedAt to current date
    deleteSchool: async (_, { id }) => {
      return await School.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    },
  },

  School: {
    // *************** Resolve the students field for a school by finding all students with schoolId matching school.id
    students: async (school) => {
      return await Student.find({ schoolId: school.id });
    },
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;