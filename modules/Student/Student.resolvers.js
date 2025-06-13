// *************** IMPORT CORE ***************
const StudentModel = require('./Student.model');

// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server-express');
const mongoose = require('mongoose');

// *************** LOADER ***************
const createStudentLoader = require('./Student.loader');

// *************** IMPORT VALIDATOR ***************
const validateStudent = require('./Student.validator');

// *************** QUERY ***************
/**
 * Retrieves all student documents from the database.
 *
 * - Uses Mongoose's `find()` method to fetch all records from the `StudentModel` collection.
 * - If the operation fails, an `ApolloError` is thrown to return a GraphQL-friendly error.
 *
 * @async
 * @function getAllStudents
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of all student objects.
 * @throws {ApolloError} If fetching students fails, an ApolloError with a descriptive message is thrown.
 */
async function getAllStudents() {
  try {
    // *************** Fetch all students from the database
    return await StudentModel.find();
  } catch (error) {
    // *************** If fetching fails, throw a descriptive GraphQL error
    throw new ApolloError(`Failed to fetch students: ${error.message}`, "INTERNAL SERVER ERROR");
  }
}

/**
 * Retrieves a single student by ID using DataLoader.
 *
 * - Validates that the provided ID is a valid MongoDB ObjectId.
 * - Uses `context.studentLoader` to efficiently load the student from the database.
 * - Returns the student if found; otherwise, throws an ApolloError indicating "NOT FOUND".
 * - Any unexpected errors during the process result in a GraphQL-compliant ApolloError.
 *
 * @async
 * @function getOneStudent
 * @param {Object} _ - Unused GraphQL resolver parameter (usually the parent/root).
 * @param {Object} args - The arguments passed to the resolver.
 * @param {string} args.id - The MongoDB ObjectId of the student to retrieve.
 * @param {Object} context - The GraphQL context containing the `studentLoader`.
 * @returns {Promise<Object>} The student object if found.
 * @throws {ApolloError} If the ID is invalid, the student is not found, or a fetch error occurs.
 */
async function getOneStudent(_, { id }, context) {
  // *************** Validate if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApolloError(`Invalid ID: ${id}`, "BAD USER INPUT");
  }
  try {
    // *************** Try to load the student using DataLoader for performance optimization
    const student = await context.studentLoader.load(id);
    // *************** If student not found, throw a GraphQL-friendly NOT FOUND error
    if (!student) {
      throw new ApolloError("Student not found", "NOT FOUND");
    }
    // *************** Return the found student object
    return student;
  } catch (error) {
    // *************** In case of unexpected error, throw an internal server error
    throw new ApolloError(`Failed to fetch student: ${error.message}`, "INTERNAL SERVER ERROR");
  }
}

// *************** MUTATION ***************
/**
 * Creates a new student document in the database.
 *
 * - Validates the input using `validateStudent`.
 * - Assigns a `createdBy` field (placeholder should be replaced with the authenticated user's ID).
 * - Saves the new student to the database using `StudentModel`.
 * - Returns the saved student object on success.
 *
 * @async
 * @function createStudent
 * @param {Object} _ - Unused GraphQL resolver parameter (usually the parent/root).
 * @param {Object} args - The arguments passed to the resolver.
 * @param {Object} args.input - The student input data to be validated and saved.
 * @returns {Promise<Object>} The newly created student document.
 * @throws {ApolloError} If validation fails or there is a problem saving the student.
 */
async function createStudent(_, { input }) {
  try {
    // *************** Validate the input payload to match the expected schema
    const validatedInput = validateStudent(input);
    // *************** Assign the creator's ID (should be dynamic based on the authenticated user)
    validatedInput.createdBy = '6846e5769e5502fce150eb67'; // Replace with auth user ID
    // *************** Create a new student instance using the validated data
    const newStudent = new StudentModel(validatedInput);
    // *************** Save the student to the database and return the result
    return await newStudent.save();
  } catch (error) {
    // *************** If something goes wrong, throw a descriptive ApolloError
    throw new ApolloError(`Failed to create student: ${error.message}`, 'STUDENT CREATION FAILED');
  }
}

/**
 * Updates an existing student in the database.
 *
 * @async
 * @function updateStudent
 * @param {object} _ - Unused parent argument from the GraphQL resolver.
 * @param {object} args - The arguments object.
 * @param {string} args.id - The ID of the student to update.
 * @param {object} args.input - The updated student data.
 * @returns {Promise<object>} The updated student document.
 * @throws {ApolloError} Throws an error if:
 *   - The provided ID is invalid.
 *   - The student is not found.
 *   - The update operation fails due to any internal issue.
 */
async function updateStudent(_, { id, input }) {
  // *************** Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApolloError(`Invalid ID: ${id}`, "BAD USER INPUT");
  }
  try {
    // *************** Validate the input data using a custom validation function
    const validatedInput = validateStudent(input);
    // *************** Add/update the timestamp to track when the document was last modified
    validatedInput.updatedAt = Date.now();
    // *************** The 'new: true' option returns the updated document
    const updatedStudent = await StudentModel.findByIdAndUpdate(id, validatedInput, { new: true });
    // *************** If no student is found with the given ID, throw a 'NOT FOUND' error
    if (!updatedStudent) {
      throw new ApolloError("Student not found", "NOT FOUND");
    }
    // *************** Return the updated student document
    return updatedStudent;
  } catch (error) {
    // *************** Catch and wrap any other errors in an ApolloError
    throw new ApolloError(`Failed to update student: ${error.message}`, 'STUDENT UPDATE FAILED');
  }
}

/**
 * Soft deletes a student by setting the `deletedBy` and `deletedAt` fields.
 *
 * @async
 * @function deleteStudent
 * @param {object} _ - Unused first argument (parent resolver value).
 * @param {object} args - Arguments object containing the student ID.
 * @param {string} args.id - The ID of the student to delete.
 * @returns {Promise<object>} The updated (soft-deleted) student document.
 * @throws {ApolloError} If the ID is invalid, the student is not found, or the operation fails.
 */
async function deleteStudent(_, { id }) {
  // *************** Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApolloError(`Invalid ID: ${id}`, "BAD USER INPUT");
  }
  try {
    // *************** Assign a hardcoded user ID to represent the user who deleted the student
    const deletedBy = '6847af632c3aafcd7ad64244';
    // *************** This includes setting 'deletedBy' and a timestamp in 'deletedAt'
    const deletedStudent = await StudentModel.findByIdAndUpdate(
      id,
      { deletedBy, deletedAt: Date.now() },
      { new: true }
    );
    // *************** If no student is found with the given ID, throw a 'NOT FOUND' error
    if (!deletedStudent) {
      throw new ApolloError("Student not found", "NOT FOUND");
    }
    // *************** Return the updated student document
    return deletedStudent;
  } catch (error) {
    // *************** If any other error occurs, wrap it in an ApolloError with a custom code
    throw new ApolloError(`Failed to delete student: ${error.message}`, 'STUDENT DELETION FAILED');
  }
}

// *************** LOADER ***************
/**
 * Loads the associated school for a given parent object using DataLoader.
 *
 * @param {Object} parent - The parent object containing `schoolId`.
 * @param {Object} _ - Unused GraphQL argument placeholder.
 * @param {Object} context - GraphQL context containing `schoolLoader`.
 * @returns {Promise<Object|null>} The loaded school object or null if no `schoolId`.
 */
async function schoolLoader(parent, _, context) {
  try {
    // *************** Check if 'parent' object has a valid 'schoolId' to resolve
    return parent.schoolId ? await context.schoolLoader.load(parent.schoolId) : null;
  } catch (error) {
    // *************** If loading fails, throw an ApolloError with a specific error code
    throw new ApolloError(`Failed to load school: ${error.message}`, "SCHOOL LOAD FAILED");
  }
}

/**
 * Resolver function to load the User who created a given resource (e.g., Student, School).
 *
 * This function is intended to be used as a GraphQL field resolver for the `createdBy` field.
 * It retrieves the User document corresponding to the `createdBy` ID using DataLoader,
 * allowing for efficient batching and caching of user lookups.
 *
 * @async
 * @function createdByLoader
 * @param {Object} parent - The parent object containing the `createdBy` user ID field.
 * @param {Object} _ - GraphQL arguments (unused placeholder).
 * @param {Object} context - The GraphQL context, expected to contain `userLoader` (DataLoader instance).
 * @returns {Promise<Object|null>} - The resolved User object, or `null` if loading fails or user not found.
 * @throws {ApolloError} - Throws a formatted error if user loading fails.
 */
async function createdByLoader(parent, _, context) {
  try {
    // *************** Use DataLoader to load the user who created this parent resource
    return await context.userLoader.load(parent.createdBy);
  } catch (error) {
    // *************** If loading the user fails, throw an ApolloError with a custom error code
    throw new ApolloError(`Failed to load user: ${error.message}`, "USER LOAD FAILED");
  }
}

/**
 * Resolver function to load the User who deleted a given resource (if available).
 *
 * This function is used as a GraphQL field resolver for the `deletedBy` field.
 * It checks if the parent object contains a `deletedBy` ID. If so, it uses the
 * `userLoader` DataLoader from the GraphQL context to fetch the corresponding User document.
 * If `deletedBy` is not present, it returns `null`.
 *
 * @async
 * @function deletedByLoader
 * @param {Object} parent - The parent object containing the `deletedBy` user ID field.
 * @param {Object} _ - GraphQL arguments (unused placeholder).
 * @param {Object} context - The GraphQL context, expected to contain `userLoader` (DataLoader instance).
 * @returns {Promise<Object|null>} - The resolved User object, or `null` if `deletedBy` is not set.
 * @throws {ApolloError} - Throws an ApolloError if an error occurs during user loading.
 */
async function deletedByLoader(parent, _, context) {
  try {
    // *************** Check if 'deletedBy' exists in the parent object
    return parent.deletedBy ? await context.userLoader.load(parent.deletedBy) : null;
  } catch (error) {
    // *************** If loading the user fails, throw an ApolloError with a descriptive message and code
    throw new ApolloError(`Failed to load user: ${error.message}`, "USER LOAD FAILED");
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  Query: { getAllStudents, getOneStudent },
  Mutation: { createStudent, updateStudent, deleteStudent },
  Student: {
    schoolId: schoolLoader,
    createdBy: createdByLoader,
    deletedBy: deletedByLoader
  }
};