// *************** IMPORT MODULE ***************
const StudentModel = require('./Student.model');

// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Mongoose = require('mongoose');

// *************** IMPORT VALIDATOR ***************
const { ValidateStudentInput } = require('./Student.validator');

// *************** QUERY ***************
/**
 * Retrieves all students with active status from the database.
 *
 * This asynchronous function queries the `StudentModel` collection
 * and returns an array of student documents where `student_status` is `'ACTIVE'`.
 * If any error occurs during the query, it throws an `ApolloError`
 * with the code `INTERNAL_SERVER_ERROR`.
 *
 * @async
 * @function GetAllStudents
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of active student documents.
 * @throws {ApolloError} If an error occurs while fetching students from the database.
 */
async function GetAllStudents() {
  try {
    // *************** Attempt to query the database using Mongoose. Only students with 'ACTIVE' student_status will be returned
    const toActiveStudents = await StudentModel.find({ student_status: 'ACTIVE' });
    return toActiveStudents;
  } catch (error) {
    // *************** If an error occurs during the query, throw an ApolloError
    throw new ApolloError(`Failed to fetch students: ${error.message}`, "INTERNAL_SERVER_ERROR");
  }
}

/**
 * Retrieves a single active student by ID from the database.
 *
 * This asynchronous function first validates whether the provided ID is a valid MongoDB ObjectId.
 * It then queries the `StudentModel` collection to find a student with the matching `_id`
 * and `student_status` equal to `'ACTIVE'`. If no student is found, or if the ID is invalid,
 * it throws an `ApolloError` with an appropriate error code and message.
 *
 * @async
 * @function GetOneStudent
 * @param {Object} _ - Unused parameter (GraphQL convention for root).
 * @param {Object} args - The arguments object.
 * @param {string} args.id - The MongoDB ObjectId of the student to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the student document if found.
 * @throws {ApolloError} If the ID is invalid, the student is not found, or a database error occurs.
 */
async function GetOneStudent(_, { id }) {
  // *************** Check if the provided ID is a valid MongoDB ObjectId
  if (!Mongoose.Types.ObjectId.isValid(id)) {
    // *************** If the ID is invalid, throw an error with BAD_USER_INPUT code
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }
  try {
    // *************** Try to find one student by ID with status 'ACTIVE'
    const student = await StudentModel.findOne({ _id: id, student_status: 'ACTIVE' });
    // *************** If no student is found, throw a NOT_FOUND error
    if (!student) {
      throw new ApolloError("Student not found", "NOT_FOUND");
    }
    // *************** If found, return the student document
    return student;
  } catch (error) {
    // *************** If any error occurs during the query, throw an internal server error
    throw new ApolloError(`Failed to fetch student: ${error.message}`, "INTERNAL_SERVER_ERROR");
  }
}

// *************** MUTATION ***************
/**
 * Creates a new student document in the database.
 *
 * This asynchronous function first validates the input using `ValidateStudentInput`.
 * It then constructs a student object by combining the input data with metadata
 * such as `student_status` in uppercase, and default `created_by` and `updated_by` values.
 * Finally, it attempts to save the new student using `StudentModel.create`.
 *
 * If an error occurs during creation, it throws an `ApolloError` with the code `STUDENT_CREATION_FAILED`.
 *
 * @async
 * @function CreateStudent
 * @param {Object} _ - Unused root argument (GraphQL convention).
 * @param {Object} args - The argument object.
 * @param {Object} args.input - The input object containing student data.
 * @returns {Promise<Object>} A promise that resolves to the newly created student document.
 * @throws {ApolloError} If validation fails or the creation process encounters an error.
 */
async function CreateStudent(_, { input }) {
  // *************** Validate the incoming student input using a custom validation function
  ValidateStudentInput(input);
  try {
    // *************** Hardcoded user ID who is creating the student
    const userId = '6846e5769e5502fce150eb67';
    // *************** Destructure input fields from GraphQL arguments
    const {
      first_name,
      last_name,
      photo_profile,
      student_birth,
      student_status,
      contact,
      address,
      school_id
    } = input;
    // *************** Build the student data object to be saved into the database
    const studentData = {
      first_name: first_name,
      last_name: last_name,
      photo_profile: photo_profile || null,
      student_birth: {
        date_of_birth: student_birth.date_of_birth,
        place_of_birth: student_birth.place_of_birth
      },
      student_status: student_status.toUpperCase(),
      contact: {
        phone_number: contact.phone_number,
        email: contact.email
      },
      address: {
        street_name: address?.street_name || null,
        city: address?.city || null,
        country: address?.country || null,
        zip_code: address?.zip_code || null
      },
      school_id: school_id || null,
      created_by: userId,
    };
    // *************** Create the student document in the database
    const toCreatedStudent = await StudentModel.create(studentData);
    return toCreatedStudent;
  } catch (error) {
    // *************** If an error occurs during creation, throw an ApolloError with details
    throw new ApolloError('Failed to create student:', 'STUDENT_CREATION_FAILED', {error: error.message});
  }
}

/**
 * Updates an existing student document by ID.
 *
 * This asynchronous function performs the following steps:
 * - Validates whether the provided ID is a valid MongoDB ObjectId.
 * - Validates the input using `ValidateStudentInput`.
 * - Constructs the updated student data by normalizing status and setting `updated_by`.
 * - Executes an update operation using `findOneAndUpdate` and returns the updated document.
 *
 * If the ID is invalid or a database error occurs, it throws an appropriate `ApolloError`.
 *
 * @async
 * @function UpdateStudent
 * @param {Object} _ - Unused root parameter (GraphQL convention).
 * @param {Object} args - Argument object.
 * @param {string} args.id - The ID of the student to update.
 * @param {Object} args.input - The input data for updating the student.
 * @returns {Promise<Object|null>} A promise that resolves to the updated student document, or `null` if not found.
 * @throws {ApolloError} If the ID is invalid, validation fails, or a database error occurs.
 */
async function UpdateStudent(_, { id, input }) {
  // *************** Check if the provided ID is a valid MongoDB ObjectId. If the ID is invalid, throw an ApolloError.
  if (!Mongoose.Types.ObjectId.isValid(id)) {
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }
  // *************** Validate the student input using a custom validator
  ValidateStudentInput(input);
  try {
    // *************** ID of the user performing the update
    const userId = '6846e5769e5502fce150eb67';
    // *************** Destructure the input object passed via GraphQL mutation arguments
    const {
      first_name,
      last_name,
      photo_profile,
      student_birth,
      student_status,
      contact,
      address,
      school_id
    } = input;
    // *************** Construct the studentData object based on the Student schema
    const studentData = {
      first_name: first_name,
      last_name: last_name,
      photo_profile: photo_profile || null,
      student_birth: {
        date_of_birth: student_birth.date_of_birth,
        place_of_birth: student_birth.place_of_birth
      },
      student_status: student_status.toUpperCase(),
      contact: {
        phone_number: contact.phone_number,
        email: contact.email
      },
      address: {
        street_name: address?.street_name || null,
        city: address?.city || null,
        country: address?.country || null,
        zip_code: address?.zip_code || null
      },
      school_id: school_id || null,
      updated_by: userId
    };
    // *************** Find the student by ID and update with the new data, returning the new document
    const toUpdatedStudent = await StudentModel.findOneAndUpdate({ _id: id }, studentData, { new: true });
    return toUpdatedStudent;
  } catch (error) {
    // *************** If an error occurs during creation, throw an ApolloError with details
    throw new ApolloError('Failed to update student:', 'STUDENT_UPDATE_FAILED', {error: error.message});
  }
}

/**
 * Soft deletes a student by marking their status as 'INACTIVE' and setting deletion metadata.
 *
 * This function:
 * - Validates whether the provided ID is a valid MongoDB ObjectId.
 * - Retrieves the student document by the provided ID.
 * - Ensures the student exists and is currently ACTIVE.
 * - Updates the student status to 'INACTIVE', records the deleter's ID and timestamp.
 * - Returns the updated student document after soft deletion.
 *
 * @param {Object} _ - Unused resolver root argument (standard in GraphQL resolvers).
 * @param {Object} args - The arguments passed to the resolver.
 * @param {string} args.id - The ID of the student to be soft-deleted.
 * @returns {Promise<Object>} The updated student document after soft deletion.
 * @throws {ApolloError} If:
 * - The provided ID is invalid.
 * - No student is found with the given ID.
 * - The student is already inactive.
 * - An error occurs during the update process.
 */
async function DeleteStudent(_, { id }) {
  // *************** Check if the provided ID is a valid MongoDB ObjectId.
  if (!Mongoose.Types.ObjectId.isValid(id)) {
    // *************** If the ID is invalid, throw an ApolloError with a BAD_USER_INPUT code
    throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
  }
  try {
    // *************** Find the student by ID and check its current status
    const student = await StudentModel.findById(id);
    if (!student) {
      // *************** If no student found with the ID, throw an error
      throw new ApolloError("Student not found", "NOT_FOUND");
    }
    if (student.student_status !== 'ACTIVE') {
      // *************** If the student is not ACTIVE, prevent deletion
      throw new ApolloError("Student is already inactive", "BAD_USER_INPUT");
    }
    // *************** Set the user ID who is performing the deletion
    const userId = '6846e5769e5502fce150eb67';
    const studentData = {
      student_status: 'INACTIVE',
      deleted_by: userId,
      deleted_at: Date.now()
    };
    // *************** Perform the update in the database and return the updated student document
    const toUpdatedStudent = await StudentModel.findOneAndUpdate({ _id: id }, studentData, { new: true });
    return toUpdatedStudent;
  } catch (error) {
    // *************** If an error occurs during the update, throw an ApolloError with details
    throw new ApolloError('Failed to delete student:', 'STUDENT_DELETION_FAILED', {error: error.message});
  }
}

// *************** LOADER ***************
/**
 * Resolver to load a school document based on the `school_id` field in the parent object.
 *
 * This function checks if `parent.school_id` exists. If it does, it uses the `SchoolLoader` DataLoader
 * from the GraphQL context to fetch and return the corresponding school document.
 * If `school_id` is missing, it returns `null`. Any errors during the loading process
 * will be thrown as an ApolloError with the code `'SCHOOL_FETCH_FAILED'`.
 *
 * @async
 * @function SchoolLoader
 * @param {Object} parent - The parent object that contains the `school_id` field.
 * @param {Object} _ - Unused GraphQL resolver arguments (placeholder).
 * @param {Object} context - GraphQL context containing the `dataLoaders` object.
 * @param {DataLoader} context.dataLoaders.SchoolLoader - DataLoader instance to batch and cache school fetches.
 * @returns {Promise<Object|null>} The school document if found, otherwise `null`.
 * @throws {ApolloError} If an error occurs during the fetch operation.
 */
async function SchoolLoader(parent, _, context) {
  try {
    // *************** Check if parent.school_id exists
    if (parent.school_id) {
      // *************** Use the SchoolLoader DataLoader to fetch school data by its ID
      const toLoadedSchool = await context.dataLoaders.SchoolLoader.load(parent.school_id);
      // *************** Return the loaded school data
      return toLoadedSchool;
    } else {
      // *************** If no school_id is present in the parent object, return null
      return null;
    }
  } catch (error) {
    // *************** If an error occurs while loading the school, throw an ApolloError
    throw new ApolloError(`Failed to load school: ${error.message}`, 'SCHOOL_FETCH_FAILED');
  }
}

/**
 * Resolver to load the user who created the parent document.
 *
 * This function uses the `created_by` field from the parent object to load
 * the associated user document via the `UserLoader` DataLoader from the context.
 * If an error occurs during the loading process, it throws an `ApolloError`.
 *
 * @async
 * @function CreatedByLoader
 * @param {Object} parent - The parent object that contains the `created_by` user ID.
 * @param {Object} _ - Unused GraphQL resolver arguments (placeholder).
 * @param {Object} context - GraphQL context containing `dataLoaders`.
 * @param {DataLoader} context.dataLoaders.UserLoader - DataLoader for batching and caching user fetches.
 * @returns {Promise<Object>} The user document who created the parent record.
 * @throws {ApolloError} If the user could not be loaded.
 */
async function CreatedByLoader(parent, _, context) {
  try {
    // *************** Use the UserLoader DataLoader to load the user by the created_by field from parent
    const toCreatorUser = await context.dataLoaders.UserLoader.load(parent.created_by);
    return toCreatorUser;
  } catch (error) {
    // *************** If an error occurs while loading the user, throw an ApolloError
    throw new ApolloError(`Failed to fetch creator: ${error.message}`, 'USER_FETCH_FAILED');
  }
}

/**
 * Resolver to load the user who last updated the parent document.
 *
 * This function retrieves the `updated_by` user ID from the parent object
 * and uses the `UserLoader` DataLoader to fetch the corresponding user document.
 * If an error occurs during the loading process, it throws an `ApolloError`
 * with the code `'USER_FETCH_FAILED'`.
 *
 * @async
 * @function UpdatedByLoader
 * @param {Object} parent - The parent object that contains the `updated_by` user ID.
 * @param {Object} _ - Unused GraphQL resolver arguments (placeholder).
 * @param {Object} context - GraphQL context containing the `dataLoaders` object.
 * @param {DataLoader} context.dataLoaders.UserLoader - DataLoader used to batch and cache user fetches.
 * @returns {Promise<Object>} A promise that resolves to the user document who last updated the record.
 * @throws {ApolloError} If the user could not be fetched.
 */
async function UpdatedByLoader(parent, _, context) {
  try {
    // *************** Use the UserLoader DataLoader to fetch the user based on the updated_by field from the parent
    const toCreatedByUser = await context.dataLoaders.UserLoader.load(parent.created_by);
    return toCreatedByUser;
  } catch (error) {
    // *************** If an error occurs while loading the user, throw an ApolloError
    throw new ApolloError(`Failed to fetch updater: ${error.message}`, 'USER_FETCH_FAILED');
  }
}

/**
 * Field resolver to retrieve the user who deleted a specific entity.
 *
 * This function checks if the `deleted_by` field exists in the parent object.
 * If it exists, it uses the User DataLoader to efficiently load and return the user who performed the deletion.
 * If not, it returns null.
 *
 * @param {Object} parent - The parent object containing the `deleted_by` reference.
 * @param {Object} _ - Unused GraphQL argument (placeholder for args).
 * @param {Object} context - The context object containing shared resources like DataLoaders.
 * @returns {Promise<Object|null>} - Returns the user who deleted the entity, or null if not available.
 * @throws {ApolloError} - Throws an error if fetching the user fails.
 */
async function DeletedByLoader(parent, _, context) {
  try {
    // *************** Check if 'deleted_by' field exists in the parent object
    if (parent.deleted_by) {
      // *************** Use DataLoader to load the user who deleted the data, based on 'deleted_by' field
      const toDeletedByUser = await context.dataLoaders.UserLoader.load(parent.deleted_by);
      // *************** Return the user data who performed the delete action
      return toDeletedByUser;
    } else {
      // *************** If 'deleted_by' is null or undefined, return null (no user performed deletion)
      return null;
    }
  } catch (error) {
    // *************** If an error occurs while loading the user, throw an ApolloError with a specific code
    throw new ApolloError(`Failed to fetch deleter: ${error.message}`, 'USER_FETCH_FAILED');
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  Query: {
    GetAllStudents,
    GetOneStudent
  },
  Mutation: {
    CreateStudent,
    UpdateStudent,
    DeleteStudent
  },
  Student: {
    school_id: SchoolLoader,
    created_by: CreatedByLoader,
    updated_by: UpdatedByLoader,
    deleted_by: DeletedByLoader
  }
};
