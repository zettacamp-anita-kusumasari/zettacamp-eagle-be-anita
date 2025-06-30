// *************** IMPORT MODULE ***************
const BlockModel = require('./Block.model');

// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Mongoose = require('mongoose');

// *************** IMPORT VALIDATOR ***************
const { ValidateBlockInput } = require('./Block.validator');

// *************** QUERY ***************
async function GetAllBlocks() {
    try {
        // *************** Try to fetch all blocks where status is ACTIVE
        const activeBlocks = await BlockModel.find({ block_status: 'ACTIVE' });
        return activeBlocks;
    } catch (error) {
        // *************** If an error occurs, throw an ApolloError with a message and error code
        throw new ApolloError(`Failed to fetch blocks: ${error.message}`, "INTERNAL_SERVER_ERROR");
    }
}

async function GetOneBlock(_, { id }) {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    try {
        // *************** Try to find a block data that has ACTIVE status by its mongoDB ObjectId
        const block = await BlockModel.findOne({ _id: id, block_status: 'ACTIVE' });
        // *************** If no block is found, throw a NOT FOUND error
        if (!block) {
        throw new ApolloError("Block not found", "NOT_FOUND");
        }
        // *************** If the system is successful, then return the fetched block data
        return block;
    } catch (error) {
        // *************** If an error occurs during the query, throw an ApolloError
        throw new ApolloError(`Failed to fetch block: ${error.message}`, "INTERNAL_SERVER_ERROR");
    }
}

// *************** MUTATION ***************
async function CreateBlock(_, { input }) {
    try {
        // *************** Set the ID of the user who is creating the block
        const userId = '6846e5769e5502fce150eb67';
        // *************** Destructure the necessary fields from the input object
        const {
            name,
            academic_year,
            block_code,
            block_status,
            block_type,
            evaluation_assessment
        } = input;
        // *************** Validate the input using exported function ValidateBlockInput
        ValidateBlockInput(input);
        // *************** (Map input fields to database schema) Construct a new block data object with properly structured fields
        const blockData = {
        name: name,
        academic_year: academic_year,
        block_code: block_code,
        block_status: block_status.toUpperCase(),
        block_type: block_type.toUpperCase(),
        evaluation_assessment: evaluation_assessment.toUpperCase(),
        created_by: userId
        };
        // *************** Save the block data to the database using Mongoose
        const toCreatedBlock = await BlockModel.create(blockData);
        return toCreatedBlock;
    } catch (error) {
        // *************** If an error occurs during the query, throw an ApolloError
        throw new ApolloError('Failed to create block:', 'BLOCK_CREATION_FAILED', {error: error.message});
    }
}

async function UpdateBlock(_, { id, input }) {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
    // *************** If the ID is invalid, throw an ApolloError with a BAD_USER_INPUT code
        throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    try {
        // *************** Hardcoded user ID who performs the update
        const userId = '6846e5769e5502fce150eb67';
        // *************** Destructure necessary fields from the input object
        const {
            name,
            academic_year,
            block_code,
            block_status,
            block_type,
            evaluation_assessment
        } = input;
        // *************** Validate the input using exported function ValidateBlockInput
        ValidateBlockInput(input);
        // *************** (Map input fields to database schema) Construct a new block data object to be used for update
        const blockData = {
            name: name,
            academic_year: academic_year,
            block_code: block_code,
            block_status: block_status.toUpperCase(),
            block_type: block_type.toUpperCase(),
            evaluation_assessment: evaluation_assessment.toUpperCase(),
            created_by: userId
        };
        // *************** Perform the update in the database and return the updated document
        const toUpdatedBlock = await BlockModel.findOneAndUpdate({ _id: id }, blockData, { new: true });
        return toUpdatedBlock;
    } catch (error) {
        // *************** If an error occurs during the update, throw an ApolloError with details
        throw new ApolloError('Failed to update block:', 'BLOCK_UPDATE_FAILED', {error: error.message});
    }
}

async function DeleteBlock(_, { id }) {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    try {
        // *************** Find the block by ID and check its current status
        const block = await BlockModel.findOne({ _id: id, block_status: 'ACTIVE' });
        if (!block) {
        // *************** If no block found with the ID, throw an error
        throw new ApolloError("Block not found or already completed", "NOT_FOUND");
        }
        // *************** Set the user ID who is performing the deletion
        const userId = '6846e5769e5502fce150eb67';
        // Update for soft delete
        const toUpdatedBlock = await BlockModel.findOneAndUpdate({ _id: id },{
            block_status: 'COMPLETED',
            deleted_by: userId,
            deleted_at: new Date()
        });
        return toUpdatedBlock;
    } catch (error) {
        // *************** If an error occurs during the update, throw an ApolloError with details
        throw new ApolloError('Failed to delete block:', 'BLOCK_DELETION_FAILED', {error: error.message});
    }
}

// *************** LOADER ***************
async function CreatedByLoader(parent, _, context) {
    try {
        // *************** Use the UserLoader DataLoader to load the user document based on parent.created_by ID
        const toCreatedByUser = await context.dataLoaders.UserLoader.load(parent.created_by);
        return toCreatedByUser;
    } catch (error) {
        // *************** If an error occurs during loading, throw an ApolloError with a custom error code and message
        throw new ApolloError(`Failed to load creator user: ${error.message}`, 'USER_FETCH_FAILED');
    }
}

async function UpdatedByLoader(parent, _, context) {
    try {
        // *************** Use the UserLoader DataLoader to load the user document based on parent.updated_by ID
        const toUpdatedByUser = await context.dataLoaders.UserLoader.load(parent.updated_by);
        return toUpdatedByUser;
    } catch (error) {
        // *************** If an error occurs during loading, throw an ApolloError with a custom error code and message
        throw new ApolloError(`Failed to load updater user: ${error.message}`, 'USER_FETCH_FAILED');
    }
}

async function DeletedByLoader(parent, _, context) {
    try {
        // *************** Check if the parent object contains the 'deleted_by' user ID
        if (parent.deleted_by) {
        // *************** If it exists, use UserLoader to load and return the user document by ID
        const toDeletedByUser = await context.dataLoaders.UserLoader.load(parent.deleted_by);
        return toDeletedByUser;
        } else {
        // *************** If 'deleted_by' is not present, return null (no user to load)
        return null;
        }
    } catch (error) {
        // *************** If an error occurs during loading, throw an ApolloError with a custom error code and message
        throw new ApolloError(`Failed to load deleter user: ${error.message}`, 'USER_FETCH_FAILED');
    }
}

// *************** EXPORT MODULE ***************
module.exports = {
  Query: {
    GetAllBlocks,
    GetOneBlock
  },
  Mutation: {
    CreateBlock,
    UpdateBlock,
    DeleteBlock
  },
  Block: {
    created_by: CreatedByLoader,
    updated_by: UpdatedByLoader,
    deleted_by: DeletedByLoader
  }
};