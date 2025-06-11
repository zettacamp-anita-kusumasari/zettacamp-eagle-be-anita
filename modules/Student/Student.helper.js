// *************** IMPORT CORE ***************
const Student = require('./Student.model');

/**
 * Retrieves all students from the database.
 *
 * @async
 * @function getAllStudents
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of student objects.
 * @throws {Error} Throws an error if there is a problem fetching the students.
 */
async function getAllStudents() {
  try {
    const students = await Student.find({});
    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

/**
 * Retrieves a single student by their ID.
 *
 * @async
 * @function getOneStudent
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The ID of the student to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the student object if found, or null if not found.
 * @throws {Error} Throws an error if there is a problem fetching the student.
 */
async function getOneStudent(_, { id }) {
  try {
    const student = await Student.findById(id);
    return student;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

/**
 * Creates a new student using the provided arguments.
 *
 * @async
 * @function createStudent
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} args - The arguments containing student data (e.g., name, age, schoolId, etc.).
 * @returns {Promise<Object>} A promise that resolves to the newly created student object.
 * @throws {Error} Throws an error if the student creation fails.
 */
async function createStudent (_, args) {
  try {
    const student = new Student(args);
    return await student.save();
  } catch (error) {
    console.error('Error creating student:', error);
    throw new Error('Failed to create student');
  }
}

/**
 * Updates an existing student by their ID with the provided update fields.
 *
 * @async
 * @function updateStudent
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The ID of the student to update.
 * @param {Object} params.updates - The fields to update in the student document.
 * @returns {Promise<Object>} A promise that resolves to the updated student object.
 * @throws {Error} Throws an error if the student is not found or the update operation fails.
 */
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

/**
 * Soft deletes a student by setting the `deletedAt` timestamp.
 *
 * @async
 * @function deleteStudent
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The ID of the student to be soft deleted.
 * @returns {Promise<Object>} A promise that resolves to the updated (soft-deleted) student object.
 * @throws {Error} Throws an error if the student is not found or the delete operation fails.
 */
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

/**
 * Retrieves the school associated with a given student.
 *
 * @async
 * @function school
 * @param {Object} student - The student object.
 * @param {string} student.schoolId - The ID of the school to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the school object if found, or null if not found.
 * @throws {Error} Throws an error if fetching the school fails.
 */
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