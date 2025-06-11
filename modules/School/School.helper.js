// *************** IMPORT CORE ***************
const School = require('./School.model');

// *************** To fetch all the schools
async function getAllSchools() {
  try {
    const schools = await School.find({});
    return schools;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
}

// *************** To fetch a single school by ID
async function getOneSchool(_, { id }) {
  try {
    const school = await School.findById(id);
    return school;
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
}

// *************** Create a new school with provided arguments
async function createSchool (_, args) {
  try {
    const school = new School(args);
    return await school.save();
  } catch (error) {
    console.error('Error creating school:', error);
    throw new Error('Failed to create school');
  }
}

// *************** Update school by ID, returning the updated document
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

// *************** Soft delete a school by setting deletedAt to current date
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

// *************** Resolve the students field for a school by finding all students with schoolId matching school.id
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