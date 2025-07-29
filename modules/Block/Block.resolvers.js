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
async function GetOneBlock(_, { _id }) {
  try {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Try to find a block data that has ACTIVE status by its mongoDB ObjectId
    const block = await BlockModel.findOne({
      _id: _id,
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
 * Creates a new block document in the database.
 *
 * @function
 * @async
 * @param {object} _ - Unused first argument, reserved by GraphQL resolver signature.
 * @param {object} args - The argument object containing `input`.
 * @param {object} args.input - The input object for creating a block.
 * @param {string} args.input.name - Name of the block.
 * @param {string} args.input.description - Description of the block.
 * @param {number} args.input.academic_year - Academic year the block belongs to.
 * @param {string} args.input.block_code - Unique code for the block.
 * @param {string} args.input.block_status - Status of the block (e.g., "ACTIVE", "INACTIVE").
 * @param {string} args.input.block_type - Type of the block (e.g., "MANDATORY", "ELECTIVE").
 * @param {string} args.input.evaluation_assessment - Type of assessment (e.g., "EXAM", "PROJECT").
 * @param {string} args.input.created_by - ID of the user who created the block.
 * @returns {Promise<object>} The created block document.
 * @throws {ApolloError} If validation fails or database operation encounters an error.
 */
async function CreateBlock(_, { created_by, input }) {
  try {
    // *************** Validate the input using exported function ValidateBlockInput
    ValidateBlockInput(input);
    // *************** Destructure the necessary fields from the input object
    const {
      name,
      description,
      academic_year,
      block_code,
      block_status,
      block_type,
      evaluation_assessment,
    } = input;
    // *************** Map input fields to database schema
    const blockData = {
      name: name,
      description: description,
      academic_year: academic_year,
      block_code: block_code,
      block_status: block_status.toUpperCase(),
      block_type: block_type.toUpperCase(),
      evaluation_assessment: evaluation_assessment.toUpperCase(),
      created_by: created_by,
    };
    // *************** Save the block data to the database using Mongoose
    const CreatedBlock = await BlockModel.create(blockData);
    return CreatedBlock;
  } catch (error) {
    // *************** If an error occurs during the create, throw an ApolloError with the error message
    throw new ApolloError("Failed to create block:", "BLOCK_CREATION_FAILED", {
      error: error.message,
    });
  }
}

/**
 * Updates an existing block document in the database by its ID.
 *
 * @function
 * @async
 * @param {object} _ - Unused first argument, required by GraphQL resolver signature.
 * @param {object} args - Arguments object containing `id` and `input`.
 * @param {string} args.id - The ID of the block to update.
 * @param {object} args.input - The input object containing updated block fields.
 * @param {string} args.input.name - Updated name of the block.
 * @param {string} args.input.description - Updated description of the block.
 * @param {number} args.input.academic_year - Updated academic year.
 * @param {string} args.input.block_code - Updated block code.
 * @param {string} args.input.block_status - Updated block status (e.g., "ACTIVE", "INACTIVE").
 * @param {string} args.input.block_type - Updated block type (e.g., "MANDATORY", "ELECTIVE").
 * @param {string} args.input.evaluation_assessment - Updated type of assessment.
 * @param {string} args.input.updated_by - ID of the user performing the update.
 * @returns {Promise<object|null>} The updated block document, or null if not found.
 * @throws {ApolloError} If the ID is invalid, validation fails, or the update operation encounters an error.
 */
async function UpdateBlock(_, { _id, updated_by, input }) {
  try {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      // *************** If the ID is invalid, throw an ApolloError with a BAD_USER_INPUT code
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Validate the input using exported function ValidateBlockInput
    ValidateBlockInput(input);
    // *************** Destructure necessary fields from the input object
    const {
      name,
      description,
      academic_year,
      block_code,
      block_status,
      block_type,
      evaluation_assessment,
    } = input;
    // *************** Map input fields to database schema
    const blockData = {
      name: name,
      description: description,
      academic_year: academic_year,
      block_code: block_code,
      block_status: block_status.toUpperCase(),
      block_type: block_type.toUpperCase(),
      evaluation_assessment: evaluation_assessment.toUpperCase(),
      updated_by: updated_by,
    };
    // *************** Perform the update in the database
    const UpdatedBlock = await BlockModel.findByIdAndUpdate(
      _id,
      { $set: blockData },
      { new: true }
    ).lean();
    // *************** Return the updated document
    return UpdatedBlock;
  } catch (error) {
    // *************** If an error occurs during the update, throw an ApolloError with the error message
    throw new ApolloError("Failed to update block:", "BLOCK_UPDATE_FAILED", {
      error: error.message,
    });
  }
}

/**
 * DeleteBlock - Soft deletes a block by updating its status to "DELETED" and setting a deletion timestamp.
 *
 * @param {Object} _ - Unused first parameter (parent/root resolver).
 * @param {Object} args - GraphQL arguments object.
 * @param {string} args.id - The MongoDB ObjectId of the block to be soft deleted.
 * @returns {Promise<Object>} A promise that resolves to the result of the update operation.
 * @throws {ApolloError} Throws an error if the ID is invalid, the block is not found, or the update fails.
 */
async function DeleteBlock(_, { _id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!_id || !Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Check if the block exists and has an ACTIVE status
    const existingBlock = await BlockModel.exists({ block_status: "ACTIVE" });
    // *************** If block is not found or already deleted, throw an error
    if (!existingBlock) {
      throw new ApolloError("Block not found or already deleted", "NOT_FOUND");
    }
    // *************** Soft delete: update block_status
    await BlockModel.updateOne(
      { _id: _id },
      { block_status: "DELETED" }
    );
    return _id;
    // *************** If an error occurs during the deletion, throw an ApolloError with the error message
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
 * @function
 * @async
 * @param {object} parent - The parent object, usually a Block document, containing `subject_ids`.
 * @param {object} _ - Unused argument, reserved by GraphQL resolver signature.
 * @param {object} context - The GraphQL context containing the `subjectLoader` DataLoader instance.
 * @param {DataLoader} context.subjectLoader - DataLoader instance for batching and caching subject fetches.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of subject documents.
 */
async function subject_ids(parent, _, context) {
  if (!parent.subject_ids) {
    // *************** Return the loaded subject documents
    return [];
  }
  // *************** Use the Subject Loader to load many subject documents by its ID
  const SubjectList = await context.subjectLoader.loadMany(
    parent.subject_ids
  );
  // *************** Return the loaded subject documents
  return SubjectList;
}

/**
 * school - Resolver to load a single School document based on the school ID in the parent Block object.
 *
 * @function
 * @async
 * @param {object} parent - The parent object (e.g., a Student or Block) containing the `school_id` field.
 * @param {object} _ - Unused argument, required by GraphQL resolver signature.
 * @param {object} context - The GraphQL context containing the `schoolLoader` DataLoader instance.
 * @param {DataLoader} context.schoolLoader - DataLoader instance used to load a school document by its ID.
 * @returns {Promise<object|null>} A promise that resolves to the loaded school document, or `null` if `school_id` is not present.
 */
async function school_id(parent, _, context) {
  // *************** Check if parent.school_id exists
  if (!parent.school_id) {
    // *************** If no school is present in the parent object, return null
    return null;
  }
  // *************** Use the School Loader to fetch school document by its ID
  const LoadedSchool = await context.schoolLoader.load(parent.school_id);
  // *************** Return the loaded school ducument
  return LoadedSchool;
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
    subject_ids,
    school_id,
  },
};
