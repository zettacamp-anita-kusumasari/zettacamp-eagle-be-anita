// *************** IMPORT CORE ***************
const School = require('./School.model');

/**
 * Retrieves all schools from the database.
 *
 * @async
 * @function getAllSchools
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of school objects.
 * @throws {Error} Throws an error if there is a problem fetching the schools.
 */
async function getAllSchools() {
  try {
    const schools = await School.find({});
    return schools;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
}

/**
 * Retrieves a single school by its ID.
 *
 * @async
 * @function getOneSchool
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The ID of the school to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the school object if found, or null if not found.
 * @throws {Error} Throws an error if there is a problem fetching the school.
 */
async function getOneSchool(_, { id }) {
  try {
    const school = await School.findById(id);
    return school;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
}

/**
 * Creates a new school using the provided arguments.
 *
 * @async
 * @function createSchool
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} args - The arguments containing school data.
 * @returns {Promise<Object>} A promise that resolves to the newly created school object.
 * @throws {Error} Throws an error if the school creation fails.
 */
async function createSchool (_, args) {
  try {
    const school = new School(args);
    return await school.save();
  } catch (error) {
    console.error('Error creating school:', error);
    throw new Error('Failed to create school');
  }
}

/**
 * Updates an existing school by its ID with the provided update fields.
 *
 * @async
 * @function updateSchool
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The ID of the school to update.
 * @param {Object} params.updates - The fields to update in the school document.
 * @returns {Promise<Object>} A promise that resolves to the updated school object.
 * @throws {Error} Throws an error if the school is not found or the update operation fails.
 */
async function updateSchool(_, { id, ...updates }) {
  try {
    const updatedSchool = await School.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedSchool) {
      throw new Error('School not found');
    }
    return updatedSchool;
  } catch (error) {
    console.error('Error updating school:', error);
    throw new Error('Failed to update school');
  }
}

/**
 * Soft deletes a school by setting its `deletedAt` timestamp.
 *
 * @async
 * @function deleteSchool
 * @param {Object} _ - Unused first argument (commonly used in GraphQL resolvers).
 * @param {Object} params - The parameters object.
 * @param {string} params.id - The ID of the school to be soft deleted.
 * @returns {Promise<Object>} A promise that resolves to the updated (soft-deleted) school object.
 * @throws {Error} Throws an error if the school is not found or the delete operation fails.
 */
async function deleteSchool(_, { id }) {
  try {
    const deletedSchool = await School.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );
    if (!deletedSchool) {
      throw new Error('School not found');
    }
    return deletedSchool;
  } catch (error) {
    console.error('Error deleting school:', error);
    throw new Error('Failed to delete school');
  }
}

/**
 * Retrieves all students associated with a given school.
 *
 * @async
 * @function students
 * @param {Object} school - The school object.
 * @param {string} school.id - The ID of the school used to find related students.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of student objects.
 * @throws {Error} Throws an error if fetching students fails.
 */
async function students(school) {
  try {
    const students = await Student.find({ schoolId: school.id });
    return students;
  } catch (error) {
    console.error('Error fetching students for school:', error);
    throw new Error('Failed to fetch students for this school');
  }
}

// *************** EXPORT MODULE ***************
module.exports = getAllSchools, getOneSchool, createSchool, updateSchool, deleteSchool, students;