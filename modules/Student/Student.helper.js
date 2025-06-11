// *************** IMPORT CORE ***************
const Student = require('./Student.model');

// *************** To fetch all the students
async function getAllStudents() {
  try {
    const students = await Student.find({});
    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

// *************** To fetch a single student by ID
async function getOneStudent(_, { id }) {
  try {
    const student = await Student.findById(id);
    return student;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

// *************** Create a new student with provided arguments
async function createStudent (_, args) {
  try {
    const student = new Student(args);
    return await student.save();
  } catch (error) {
    console.error('Error creating student:', error);
    throw new Error('Failed to create student');
  }
}

// *************** Update student by ID, returning the updated document
async function updateStudent(_, { id, ...updates }) {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedStudent) {
      throw new Error('Student not found');
    }
    return updatedStudent;
  } catch (error) {
    console.error('Error updating student:', error);
    throw new Error('Failed to update student');
  }
}

// *************** Soft delete a student by setting deletedAt to current date
async function deleteStudent(_, { id }) {
  try {
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );
    if (!deletedStudent) {
      throw new Error('Student not found');
    }
    return deletedStudent;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw new Error('Failed to delete student');
  }
}

// *************** Resolve the school field for a student by finding school with student.schoolId
async function school(student) {
  try {
    const school = await School.findById(student.schoolId);
    return school;
  } catch (error) {
    console.error('Error fetching school for student:', error);
    throw new Error('Failed to fetch school for this student');
  }
}

// *************** EXPORT MODULE ***************
module.exports = getAllStudents, getOneStudent, createStudent, updateStudent, deleteStudent, school;