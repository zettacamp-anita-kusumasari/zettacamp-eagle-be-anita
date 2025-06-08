// *************** IMPORT CORE ***************
const Student = require('./Student.model');

const resolvers = {
  Query: {
    // *************** To fetch all the students
    students: async () => await Student.find({}),

    // *************** To fetch a single student by ID
    student: async (_, { id }) => await Student.findById(id),
  },

  Mutation: {
    // *************** Create a new student with provided args (arguments/parameters)
    createStudent: async (_, args) => {
      const student = new Student(args);
      return await student.save();
    },

    // *************** Update student by ID, returning the updated document
    updateStudent: async (_, { id, ...updates }) => {
      return await Student.findByIdAndUpdate(id, updates, { new: true });
    },

    // *************** Soft delete a student by setting deletedAt to current date
    deleteStudent: async (_, { id }) => {
      return await Student.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    },
  },

  Student: {
    // *************** Resolve the school field for a student by finding school with student.schoolId
    school: async (student) => {
      return await School.findById(student.schoolId);
    },
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;