// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server-express");
const Mongoose = require("mongoose");

// *************** IMPORT MODULE ***************
const SchoolModel = require("./School.model");

// *************** IMPORT VALIDATOR ***************
const { ValidateSchoolInput } = require("./School.validator");

// *************** QUERY ***************
/**
 * Retrieves all schools with the status "ACTIVE" from the database.
 *
 * This function queries the SchoolModel to find all documents where
 * `school_status` is set to `'ACTIVE'`. If the operation fails,
 * it throws an ApolloError with a detailed message.
 *
 * @async
 * @function GetAllSchools
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of active school documents.
 * @throws {ApolloError} If there is an error during the database operation.
 */
async function GetAllSchools() {
  try {
    // *************** Attempt to query the database using Mongoose. Only schools with 'ACTIVE' school_status will be returned
    const activeSchools = await SchoolModel.find({
      school_status: "ACTIVE",
    }).lean();
    return activeSchools;
  } catch (error) {
    // *************** If an error occurs during the query, throw an ApolloError
    throw new ApolloError(
      `Failed to fetch schools: ${error.message}`,
      "INTERNAL_SERVER_ERROR"
    );
  }
}

/**
 * Retrieves a single active school by its ID.
 *
 * This function validates the given MongoDB ObjectId. If valid, it attempts
 * to find a school document with a matching `_id` and a `school_status` of `'ACTIVE'`.
 * If the ID is invalid or no school is found, it throws an appropriate ApolloError.
 *
 * @async
 * @function GetOneSchool
 * @param {Object} _ - Unused first argument (GraphQL resolver convention).
 * @param {Object} args - An object containing the ID of the school to retrieve.
 * @param {string} args.id - The ID of the school to find.
 * @returns {Promise<Object>} A promise that resolves to the school document if found.
 * @throws {ApolloError} If the ID is invalid, the school is not found, or a database error occurs.
 */
async function GetOneSchool(_, { _id }) {
  // *************** Check if the provided ID is a valid MongoDB ObjectId
  if (!Mongoose.Types.ObjectId.isValid(_id)) {
    // *************** If the ID is invalid, throw a BAD_USER_INPUT error
    throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
  }
  try {
    // *************** Query the database for a school with the given ID and status 'ACTIVE'
    const school = await SchoolModel.findOne({
      _id: _id,
      school_status: "ACTIVE",
    }).lean();
    // *************** If no matching school is found, throw a NOT_FOUND error
    if (!school) {
      throw new ApolloError("School not found", "NOT_FOUND");
    }
    // *************** If found, return the school document
    return school;
  } catch (error) {
    // *************** If an error occurs during the query, throw an ApolloError
    throw new ApolloError(
      `Failed to fetch school: ${error.message}`,
      "INTERNAL_SERVER_ERROR"
    );
  }
}

// *************** MUTATION ***************
/**
 * Creates a new school document in the database.
 *
 * This function validates the input using `ValidateSchoolInput`, constructs the school data
 * including formatted address and status, and assigns fixed `created_by` and `updated_by` user IDs.
 * If successful, the school document is saved to the database.
 * If an error occurs, it throws an ApolloError with a custom error code and message.
 *
 * @async
 * @function CreateSchool
 * @param {Object} _ - Unused GraphQL resolver root argument.
 * @param {Object} args - Arguments object containing the school input.
 * @param {Object} args.input - The input object containing the new school data.
 * @param {string} args.input.name - The name of the school.
 * @param {Object} args.input.address - The address details of the school.
 * @param {string} args.input.address.street_name - Street name of the school.
 * @param {string} args.input.address.city - City where the school is located.
 * @param {string} args.input.address.country - Country where the school is located.
 * @param {string} args.input.address.zip_code - ZIP code of the school.
 * @param {string} args.input.school_status - Status of the school (e.g., 'active').
 * @returns {Promise<Object>} A promise that resolves to the newly created school document.
 * @throws {ApolloError} If validation fails or a database error occurs.
 */
async function CreateSchool(_, { input }) {
  try {
    // *************** Set the ID of the user who is creating the school
    const userId = "6846e5769e5502fce150eb67";
    // *************** Destructure the necessary fields from the input object
    const { legal_name, commercial_name, logo, address, school_status } = input;
    // *************** Validate the input using exported function ValidateSchoolInput
    ValidateSchoolInput(input);
    // *************** (Map input fields to database schema) Construct a new school data object with properly structured fields
    const schoolData = {
      legal_name: legal_name,
      commercial_name: commercial_name,
      logo: logo || null,
      address: {
        street_name: address.street_name,
        city: address.city,
        country: address.country,
        zip_code: address.zip_code,
      },
      school_status: school_status.toUpperCase(),
      created_by: userId,
    };
    // *************** Save the school data to the database using Mongoose
    const toCreatedSchool = await SchoolModel.create(schoolData);
    return toCreatedSchool;
  } catch (error) {
    // *************** If an error occurs during the query, throw an ApolloError
    throw new ApolloError(
      "Failed to create school:",
      "SCHOOL_CREATION_FAILED",
      { error: error.message }
    );
  }
}

/**
 * Updates an existing school document by its ID.
 *
 * This function first validates the given MongoDB ObjectId. If valid, it validates
 * the input using `ValidateSchoolInput`, prepares the update data (including address formatting
 * and uppercasing the school status), and performs an update using `findOneAndUpdate`.
 * Returns the updated school document if successful.
 *
 * @async
 * @function UpdateSchool
 * @param {Object} _ - Unused GraphQL resolver root argument.
 * @param {Object} args - Arguments object containing the school ID and input data.
 * @param {string} args.id - The ID of the school to update.
 * @param {Object} args.input - The input object containing updated school data.
 * @param {string} args.input.name - Updated name of the school.
 * @param {Object} args.input.address - Updated address details.
 * @param {string} args.input.address.street_name - Updated street name.
 * @param {string} args.input.address.city - Updated city.
 * @param {string} args.input.address.country - Updated country.
 * @param {string} args.input.address.zip_code - Updated ZIP code.
 * @param {string} args.input.school_status - Updated school status (e.g., 'active').
 * @returns {Promise<Object>} A promise that resolves to the updated school document.
 * @throws {ApolloError} If the ID is invalid, validation fails, or the update operation fails.
 */
async function UpdateSchool(_, { _id, input }) {
  // *************** Check if the provided ID is a valid MongoDB ObjectId.
  if (!Mongoose.Types.ObjectId.isValid(_id)) {
    // *************** If the ID is invalid, throw an ApolloError with a BAD_USER_INPUT code
    throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
  }
  try {
    // *************** Hardcoded user ID who performs the update
    const userId = "6846e5769e5502fce150eb67";
    // *************** Destructure necessary fields from the input object
    const { legal_name, commercial_name, logo, address, school_status } = input;
    // *************** Validate the input using exported function ValidateSchoolInput
    ValidateSchoolInput(input);
    // *************** (Map input fields to database schema) Construct a new school data object to be used for update
    const schoolData = {
      legal_name: legal_name,
      commercial_name: commercial_name,
      logo: logo || null,
      address: {
        street_name: address.street_name,
        city: address.city,
        country: address.country,
        zip_code: address.zip_code,
      },
      school_status: school_status.toUpperCase(),
      updated_by: userId,
    };
    // *************** Perform the update in the database and return the updated document
    const toUpdatedSchool = await SchoolModel.findOneAndUpdate(
      { _id: _id },
      schoolData,
      { new: true }
    ).lean();
    return toUpdatedSchool;
  } catch (error) {
    // *************** If an error occurs during the update, throw an ApolloError with details
    throw new ApolloError("Failed to update school:", "SCHOOL_UPDATE_FAILED", {
      error: error.message,
    });
  }
}

/**
 * Soft deletes a school by setting its status to 'INACTIVE' and logging deletion metadata.
 *
 * This function:
 * - Validates whether the given ID is a valid MongoDB ObjectId.
 * - Finds the school document by the provided ID.
 * - Ensures the school exists and is currently active.
 * - Updates the school document to set its status to 'INACTIVE',
 *   records the deleter's user ID, and logs the deletion timestamp.
 * - Returns the updated school document.
 *
 * @param {Object} _ - Unused GraphQL resolver root argument.
 * @param {Object} args - The arguments object containing input values.
 * @param {string} args.id - The ID of the school to be soft-deleted.
 * @returns {Promise<Object>} The updated school document after soft deletion.
 * @throws {ApolloError} If:
 * - The provided ID is invalid.
 * - No school is found with the given ID.
 * - The school is already inactive.
 * - An error occurs during the update process.
 */
async function DeleteSchool(_, { _id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }

    // *************** Find and update the school (soft delete)
    const deletedSchool = await SchoolModel.findOneAndUpdate(
      { _id: _id, school_status: "ACTIVE" },
      {
        school_status: "INACTIVE",
        deleted_at: new Date(),
      },
      { new: true }
    ).lean();

    // *************** If not found, throw error
    if (!deletedSchool) {
      throw new ApolloError("School not found or already deleted", "NOT_FOUND");
    }

    return deletedSchool;
  } catch (error) {
    throw new ApolloError(
      "Failed to delete School",
      "SCHOOL_DELETION_FAILED",
      { error: error.message }
    );
  }
}

// *************** LOADER ***************
/**
 * Loads multiple student documents based on an array of student IDs from the parent object.
 *
 * This function uses DataLoader to batch and cache the retrieval of student records.
 * It attempts to load all student IDs provided in `parent.students`. If the list is empty or
 * undefined, it defaults to an empty array. If an error occurs during the loading process,
 * an ApolloError is thrown.
 *
 * @async
 * @function StudentLoader
 * @param {Object} parent - The parent object containing the `students` field (array of IDs).
 * @param {Object} _ - Unused argument (GraphQL resolver convention).
 * @param {Object} context - The GraphQL context containing the DataLoader instance.
 * @param {Object} context.dataLoaders - Object holding all available DataLoaders.
 * @param {DataLoader} context.dataLoaders.StudentLoader - DataLoader instance for student records.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of student documents.
 * @throws {ApolloError} If loading students fails.
 */
async function student_ids(parent, _, context) {
  // *************** Check if parent.student_ids exists
  if (!parent.student_ids) {
    // *************** If no student_ids is present in the parent object, return null
    return [];
  }
  // *************** Use the studentLoader to load many test documents by its ID
  const toStudentList = await context.studentLoader.loadMany(parent.student_ids);
  // *************** Return the loaded test documents
  return toStudentList;
}

/**
 * Loads the user who created the parent document using DataLoader.
 *
 * This function retrieves the `created_by` field from the parent object, which contains
 * a user ID, and uses the `UserLoader` DataLoader from the context to load the corresponding user document.
 * If an error occurs during the loading process, it throws an ApolloError.
 *
 * @async
 * @function CreatedByLoader
 * @param {Object} parent - The parent object containing the `created_by` user ID.
 * @param {Object} _ - Unused argument (GraphQL resolver convention).
 * @param {Object} context - The GraphQL context containing DataLoaders.
 * @param {Object} context.dataLoaders - Object containing all available DataLoaders.
 * @param {DataLoader} context.dataLoaders.UserLoader - DataLoader instance for user records.
 * @returns {Promise<Object|null>} A promise that resolves to the user document or null if not found.
 * @throws {ApolloError} If loading the user fails.
 */
async function created_by(parent, _, context) {
  if (parent.created_by) {
    // *************** Use the UserLoader DataLoader to load the user document based on parent.created_by ID
    const toCreatedByUser = await context.dataLoaders.UserLoader.load(
      parent.created_by
    );
    return toCreatedByUser;
  } else {
    // *************** If 'deleted_by' is not present, return null (no user to load)
    return null;
  }
}

/**
 * Loads the user who last updated the parent document using DataLoader.
 *
 * This function retrieves the `updated_by` field from the parent object, which contains
 * a user ID, and uses the `UserLoader` DataLoader from the context to load the corresponding user document.
 * If an error occurs during the loading process, it throws an ApolloError.
 *
 * @async
 * @function UpdatedByLoader
 * @param {Object} parent - The parent object containing the `updated_by` user ID.
 * @param {Object} _ - Unused argument (GraphQL resolver convention).
 * @param {Object} context - The GraphQL context containing DataLoaders.
 * @param {Object} context.dataLoaders - Object containing all available DataLoaders.
 * @param {DataLoader} context.dataLoaders.UserLoader - DataLoader instance for user records.
 * @returns {Promise<Object|null>} A promise that resolves to the user document or null if not found.
 * @throws {ApolloError} If loading the user fails.
 */
async function updated_by(parent, _, context) {
  if (parent.updated_by) {
    // *************** Use the UserLoader DataLoader to load the user document based on parent.updated_by ID
    const toUpdatedByUser = await context.dataLoaders.UserLoader.load(
      parent.updated_by
    );
    return toUpdatedByUser;
  } else {
    // *************** If 'deleted_by' is not present, return null (no user to load)
    return null;
  }
}

/**
 * Loads the user who deleted the parent document using DataLoader, if available.
 *
 * This function checks if the `deleted_by` field exists in the parent object.
 * If it exists, it uses the `UserLoader` DataLoader to load and return the user document.
 * If `deleted_by` is not present, it returns `null`. Any error during the process
 * will result in an ApolloError being thrown.
 *
 * @async
 * @function DeletedByLoader
 * @param {Object} parent - The parent object containing the `deleted_by` user ID.
 * @param {Object} _ - Unused argument (GraphQL resolver convention).
 * @param {Object} context - The GraphQL context containing DataLoaders.
 * @param {Object} context.dataLoaders - An object containing all DataLoader instances.
 * @param {DataLoader} context.dataLoaders.UserLoader - DataLoader instance for loading user documents.
 * @returns {Promise<Object|null>} A promise that resolves to the user document or null if `deleted_by` is not defined.
 * @throws {ApolloError} If an error occurs during the loading process.
 */
async function deleted_by(parent, _, context) {
  // *************** Check if the parent object contains the 'deleted_by' user ID
  if (parent.deleted_by) {
    // *************** If it exists, use UserLoader to load and return the user document by ID
    const toDeletedByUser = await context.dataLoaders.UserLoader.load(
      parent.deleted_by
    );
    return toDeletedByUser;
  } else {
    // *************** If 'deleted_by' is not present, return null (no user to load)
    return null;
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  Query: {
    GetAllSchools,
    GetOneSchool,
  },
  Mutation: {
    CreateSchool,
    UpdateSchool,
    DeleteSchool,
  },
  School: {
    student_ids,
    created_by,
    updated_by,
    deleted_by,
  },
};
