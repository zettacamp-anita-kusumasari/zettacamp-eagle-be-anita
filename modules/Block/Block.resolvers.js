// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Mongoose = require("mongoose");

// *************** IMPORT MODULE ***************
const BlockModel = require("./Block.model");

// *************** IMPORT VALIDATOR ***************
const { ValidateBlockInput } = require("./Block.validator");

// *************** QUERY ***************
/**
 * GetAllBlocks - Fetches all blocks from the database with status "ACTIVE".
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of active block documents.
 * @throws {ApolloError} Throws an error if the database query fails.
 */
async function GetAllBlocks() {
  try {
    // *************** Attempt to fetch all blocks with block_status set to "ACTIVE"
    const activeBlocks = await BlockModel.find({
      block_status: "ACTIVE",
    }).lean();

    // *************** Return the list of active blocks
    return activeBlocks;
  } catch (error) {
    // *************** If an error occurs during the database operation, throw an ApolloError
    throw new ApolloError(
      `Failed to fetch blocks: ${error.message}`,
      "INTERNAL_SERVER_ERROR"
    );
  }
}

/**
 * GetOneBlock - Fetches a single block by its ID, only if it is ACTIVE.
 *
 * @param {Object} _ - Unused first parameter (parent/root resolver).
 * @param {Object} args - GraphQL arguments object.
 * @param {string} args.id - The MongoDB ObjectId of the block to fetch.
 * @returns {Promise<Object>} A promise that resolves to the block document if found.
 * @throws {ApolloError} Throws an error if the ID is invalid or if the query fails.
 */
async function GetOneBlock(_, { id }) {
  try {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Try to find a block data that has ACTIVE status by its mongoDB ObjectId
    const block = await BlockModel.findOne({
      _id: id,
      block_status: "ACTIVE",
    }).lean();
    // *************** If no block is found, throw a NOT FOUND error
    if (!block) {
      throw new ApolloError("Block not found", "NOT_FOUND");
    }
    // *************** If the system is successful, then return the fetched block data
    return block;
  } catch (error) {
    // *************** If an error occurs during the query, throw an ApolloError
    throw new ApolloError(
      `Failed to fetch block: ${error.message}`,
      "INTERNAL_SERVER_ERROR"
    );
  }
}

// *************** MUTATION ***************
/**
 * CreateBlock - Creates a new block document in the database.
 *
 * @param {Object} _ - Unused first parameter (parent/root resolver).
 * @param {Object} args - GraphQL arguments object.
 * @param {Object} args.input - The input fields for creating a block.
 * @param {string} args.input.name - The name of the block.
 * @param {string} args.input.description - A description of the block.
 * @param {string} args.input.academic_year - The academic year of the block.
 * @param {string} args.input.block_code - The code assigned to the block.
 * @param {string} args.input.block_status - The current status of the block.
 * @param {string} args.input.block_type - The type/category of the block.
 * @param {string} args.input.evaluation_assessment - The evaluation method used.
 * @returns {Promise<Object>} A promise that resolves to the newly created block document.
 * @throws {ApolloError} Throws an error if validation fails or if database insertion fails.
 */
async function CreateBlock(_, { input }) {
  try {
    // *************** Destructure the necessary fields from the input object
    const {
      name,
      description,
      academic_year,
      block_code,
      block_status,
      block_type,
      evaluation_assessment,
      user_id
    } = input;
    // *************** Validate the input using exported function ValidateBlockInput
    ValidateBlockInput(input);
    // *************** Map input fields to database schema
    const blockData = {
      name: name,
      description: description,
      academic_year: academic_year,
      block_code: block_code,
      block_status: block_status.toUpperCase(),
      block_type: block_type.toUpperCase(),
      evaluation_assessment: evaluation_assessment.toUpperCase(),
      user_id: user_id
    };
    // *************** Save the block data to the database using Mongoose
    const toCreatedBlock = await BlockModel.create(blockData);
    return toCreatedBlock;
  } catch (error) {
    // *************** If an error occurs during the query, throw an ApolloError
    throw new ApolloError("Failed to create block:", "BLOCK_CREATION_FAILED", {
      error: error.message,
    });
  }
}

/**
 * UpdateBlock - Updates an existing block document by its ID.
 *
 * @param {Object} _ - Unused first parameter (parent/root resolver).
 * @param {Object} args - GraphQL arguments object.
 * @param {string} args.id - The MongoDB ObjectId of the block to be updated.
 * @param {Object} args.input - The input fields for updating the block.
 * @param {string} args.input.name - The updated name of the block.
 * @param {string} args.input.description - The updated description of the block.
 * @param {string} args.input.academic_year - The updated academic year.
 * @param {string} args.input.block_code - The updated block code.
 * @param {string} args.input.block_status - The updated status of the block.
 * @param {string} args.input.block_type - The updated type of the block.
 * @param {string} args.input.evaluation_assessment - The updated evaluation method.
 * @returns {Promise<Object|null>} A promise that resolves to the updated block document, or null if not found.
 * @throws {ApolloError} Throws an error if the ID is invalid, validation fails, or the update operation fails.
 */
async function UpdateBlock(_, { id, input }) {
  try {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      // *************** If the ID is invalid, throw an ApolloError with a BAD_USER_INPUT code
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Destructure necessary fields from the input object
    const {
      name,
      description,
      academic_year,
      block_code,
      block_status,
      block_type,
      evaluation_assessment,
      user_id
    } = input;
    // *************** Validate the input using exported function ValidateBlockInput
    ValidateBlockInput(input);
    // *************** Map input fields to database schema
    const blockData = {
      name: name,
      description: description,
      academic_year: academic_year,
      block_code: block_code,
      block_status: block_status.toUpperCase(),
      block_type: block_type.toUpperCase(),
      evaluation_assessment: evaluation_assessment.toUpperCase(),
      user_id: user_id
    };
    // *************** Perform the update in the database and return the updated document
    const toUpdatedBlock = await BlockModel.findOneAndUpdate(
      { _id: id },
      blockData,
      { new: true }
    ).lean();
    return toUpdatedBlock;
  } catch (error) {
    // *************** If an error occurs during the update, throw an ApolloError with details
    throw new ApolloError("Failed to update block:", "BLOCK_UPDATE_FAILED", {
      error: error.message,
    });
  }
}

/**
 * DeleteBlock - Soft deletes a block by updating its status to "COMPLETED" and setting a deletion timestamp.
 *
 * @param {Object} _ - Unused first parameter (parent/root resolver).
 * @param {Object} args - GraphQL arguments object.
 * @param {string} args.id - The MongoDB ObjectId of the block to be soft deleted.
 * @returns {Promise<Object>} A promise that resolves to the result of the update operation.
 * @throws {ApolloError} Throws an error if the ID is invalid, the block is not found, or the update fails.
 */
async function DeleteBlock(_, { id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Check if the block exists and has an ACTIVE status
    const existingBlock = await BlockModel.exists({
      _id: id,
      block_status: "ACTIVE",
    });
    // *************** If block is not found or already completed, throw an error
    if (!existingBlock) {
      throw new ApolloError(
        "Block not found or already completed",
        "NOT_FOUND"
      );
    }

    // *************** Soft delete: update block_status and set deleted_at timestamp
    const updateResult = await BlockModel.updateOne(
      { _id: id },
      {
        block_status: "COMPLETED",
        deleted_at: new Date(),
      }
    );
    return updateResult;
    // *************** If an error occurs during the update, throw an ApolloError with details
  } catch (error) {
    throw new ApolloError("Failed to delete block", "BLOCK_DELETION_FAILED", {
      error: error.message,
    });
  }
}

// *************** LOADER ***************

/**
 * subject - Resolver to load multiple Subject documents based on subject_ids in the parent Block object.
 *
 * @param {Object} parent - The parent object, typically a Block, which contains subject_ids.
 * @param {Object} _ - Unused GraphQL args parameter.
 * @param {Object} context - The GraphQL context object containing the SubjectLoader instance.
 * @param {Object} context.dataLoaders.SubjectLoader - DataLoader for batching and caching Subject fetches.
 * @returns {Promise<Array>} A promise that resolves to an array of Subject documents, or an empty array if none.
 */
async function subject(parent, _, context) {
  if (parent.subject_ids) {
    // *************** Use the Subject Loader to load many subject documents by its ID
    const toSubjectList = await context.dataLoaders.SubjectLoader.loadMany(
      parent.subject_ids
    );
    // *************** Return the loaded subject documents
    return toSubjectList;
  } else {
    // *************** If no subject_id is present in the parent object, return empty
    return [];
  }
}

/**
 * school - Resolver to load a single School document based on the school ID in the parent Block object.
 *
 * @param {Object} parent - The parent object (typically a Block), which contains the school ID.
 * @param {Object} _ - Unused GraphQL args parameter.
 * @param {Object} context - The GraphQL context object containing the SchoolLoader instance.
 * @param {Object} context.dataLoaders.SchoolLoader - DataLoader for batching and caching School fetches.
 * @returns {Promise<Object|null>} A promise that resolves to the School document, or null if not found or not provided.
 */
async function school(parent, _, context) {
  // *************** Check if parent.school_id exists
  if (parent.school) {
    // *************** Use the School Loader to fetch school document by its ID
    const toLoadedSchool = await context.dataLoaders.SchoolLoader.load(
      parent.school
    );
    // *************** Return the loaded school ducument
    return toLoadedSchool;
  } else {
    // *************** If no school is present in the parent object, return null
    return null;
  }
}

/**
 * created_by - Resolver to load the User document who created the current parent entity.
 *
 * @param {Object} parent - The parent object that contains the `created_by` field (User ID).
 * @param {Object} _ - Unused GraphQL args parameter.
 * @param {Object} context - The GraphQL context object containing the UserLoader instance.
 * @param {Object} context.dataLoaders.UserLoader - DataLoader for batching and caching User fetches.
 * @returns {Promise<Object|null>} A promise that resolves to the User document, or null if not available.
 */
async function created_by(parent, _, context) {
  // *************** Check if the parent object contains the created_by user ID
  if (parent.created_by) {
    // *************** Use the User Loader to load the user document based on parent.created_by ID
    const toCreatedByUser = await context.dataLoaders.UserLoader.load(
      parent.created_by
    );
    return toCreatedByUser;
  } else {
    // *************** If no created_by is present in the parent object, return null
    return null;
  }
}

/**
 * updated_by - Resolver to load the User document who last updated the current parent entity.
 *
 * @param {Object} parent - The parent object that contains the `updated_by` field (User ID).
 * @param {Object} _ - Unused GraphQL args parameter.
 * @param {Object} context - The GraphQL context object containing the UserLoader instance.
 * @param {Object} context.dataLoaders.UserLoader - DataLoader for batching and caching User fetches.
 * @returns {Promise<Object|null>} A promise that resolves to the User document, or null if not available.
 */
async function updated_by(parent, _, context) {
  // *************** Check if the parent object contains the updated_by user ID
  if (parent.updated_by) {
    // *************** Use the User Loader to load the user document based on parent.updated_by ID
    const toUpdatedByUser = await context.dataLoaders.UserLoader.load(
      parent.updated_by
    );
    return toUpdatedByUser;
  } else {
    // *************** If no updated_by is present in the parent object, return null
    return null;
  }
}

/**
 * deleted_by - Resolver to load the User document who deleted the current parent entity.
 *
 * @param {Object} parent - The parent object that contains the `deleted_by` field (User ID).
 * @param {Object} _ - Unused GraphQL args parameter.
 * @param {Object} context - The GraphQL context object containing the UserLoader instance.
 * @param {Object} context.dataLoaders.UserLoader - DataLoader for batching and caching User fetches.
 * @returns {Promise<Object|null>} A promise that resolves to the User document who deleted the entity, or null if not available.
 */
async function deleted_by(parent, _, context) {
  // *************** Check if the parent object contains the deleted_by user ID
  if (parent.deleted_by) {
    // *************** If it exists, use User Loader to load and return the user document by ID
    const toDeletedByUser = await context.dataLoaders.UserLoader.load(
      parent.deleted_by
    );
    return toDeletedByUser;
  } else {
    // *************** If deleted_by is not present, return null (no user to load)
    return null;
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  Query: {
    GetAllBlocks,
    GetOneBlock,
  },
  Mutation: {
    CreateBlock,
    UpdateBlock,
    DeleteBlock,
  },
  Block: {
    subject,
    school,
    created_by,
    updated_by,
    deleted_by,
  },
};
