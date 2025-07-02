// *************** IMPORT MODULE ***************
const SubjectModel = require('./Subject.model');

// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Mongoose = require('mongoose');

// *************** IMPORT VALIDATOR ***************
const { ValidateSubjectInput } = require('./Subject.validator');

// *************** QUERY ***************
async function GetAllSubjects() {
    try {
        // *************** Try to fetch all subjects where status is ACTIVE
        const activeSubjects = await SubjectModel.find({ subject_status: 'ACTIVE' });
        return activeSubjects;
    } catch (error) {
        // *************** If an error occurs, throw an ApolloError with a message and error code
        throw new ApolloError(`Failed to fetch subjects: ${error.message}`, "INTERNAL_SERVER_ERROR");
    }
}

async function GetOneSubject(_, { id }) {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    try {
        // *************** Try to find a subject data that has ACTIVE status by its mongoDB ObjectId
        const subject = await SubjectModel.findOne({ _id: id, subject_status: 'ACTIVE' });
        // *************** If no subject is found, throw a NOT FOUND error
        if (!subject) {
        throw new ApolloError("Subject not found", "NOT_FOUND");
        }
        // *************** If the system is successful, then return the fetched subject data
        return subject;
    } catch (error) {
        // *************** If an error occurs during the query, throw an ApolloError
        throw new ApolloError(`Failed to fetch subject: ${error.message}`, "INTERNAL_SERVER_ERROR");
    }
}

// async function GetStudentWeightAverage( ) {
    
// }

// *************** MUTATION ***************
async function CreateSubject(_, { input }) {
    try {
        // *************** Set the ID of the user who is creating the subject
        const userId = '6846e5769e5502fce150eb67';
        // *************** Destructure the necessary fields from the input object
        const {
            name,
            description,
            coefficient,
            subject_code,
            subject_status
        } = input;
        // *************** Validate the input using exported function ValidateSubjectInput
        ValidateSubjectInput(input);
        // *************** (Map input fields to database schema) Construct a new subject data object with properly structured fields
        const subjectData = {
        name: name,
        description: description,
        coefficient: coefficient,
        subject_code: subject_code,
        subject_status: subject_status.toUpperCase(),
        created_by: userId
        };
        // *************** Save the subject data to the database using Mongoose
        const toCreatedSubject = await SubjectModel.create(subjectData);
        return toCreatedSubject;
    } catch (error) {
        // *************** If an error occurs during the query, throw an ApolloError
        throw new ApolloError('Failed to create subject:', 'SUBJECT_CREATION_FAILED', {error: error.message});
    }
}

async function UpdateSubject(_, { id, input }) {
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
            description,
            coefficient,
            subject_code,
            subject_status
        } = input;
        // *************** Validate the input using exported function ValidateSubjectInput
        ValidateSubjectInput(input);
        // *************** (Map input fields to database schema) Construct a new block data object to be used for update
        const subjectData = {
            name: name,
            description: description,
            coefficient: coefficient,
            subject_code: subject_code,
            subject_status: subject_status.toUpperCase(),
            created_by: userId
        };
        // *************** Perform the update in the database and return the updated document
        const toUpdatedSubject = await SubjectModel.findOneAndUpdate({ _id: id }, subjectData, { new: true });
        return toUpdatedSubject;
    } catch (error) {
        // *************** If an error occurs during the update, throw an ApolloError with details
        throw new ApolloError('Failed to update subject:', 'SUBJECT_UPDATE_FAILED', {error: error.message});
    }
}

async function DeleteSubject(_, { id }) {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    try {
        // *************** Find the subject by ID and check its current status
        const subject = await SubjectModel.findOne({ _id: id, subject_status: 'ACTIVE' });
        if (!subject) {
        // *************** If no subject found with the ID, throw an error
        throw new ApolloError("Subject not found or already completed", "NOT_FOUND");
        }
        // *************** Set the user ID who is performing the deletion
        const userId = '6846e5769e5502fce150eb67';
        // *************** Update for soft delete
        const toUpdatedSubject = await SubjectModel.findOneAndUpdate({ _id: id },{
            subject_status: 'COMPLETED',
            deleted_by: userId,
            deleted_at: new Date()
        });
        return toUpdatedSubject;
    } catch (error) {
        // *************** If an error occurs during the update, throw an ApolloError with details
        throw new ApolloError('Failed to delete subject:', 'SUBJECT_DELETION_FAILED', {error: error.message});
    }
}

// *************** LOADER ***************

// Load multiple Test documents in the Subject Model
async function TestLoader(parent, _, context) {
  try {
    // *************** Use the TestLoader to load many test documents by its ID
    const toTestList = await context.dataLoaders.TestLoader.loadMany(parent.tests);
    // *************** Return the loaded test documents
    return toTestList;
  } catch (error) {
    // *************** If an error occurs during loading the tests, throw an ApolloError
    throw new ApolloError(`Failed to load tests: ${error.message}`, 'TEST_FETCH_FAILED');
  }
}

// Load one Block document in the Subject Model
async function BlockLoader(parent, _, context) {
  try {
    // *************** Check if parent.block_id exists
    if (parent.block_id) {
      // *************** Use the BlockLoader to fetch block document by its ID
      const toLoadedBlock = await context.dataLoaders.BlockLoader.load(parent.block_id);
      // *************** Return the loaded block ducument
      return toLoadedBlock;
    } else {
      // *************** If no block_id is present in the parent object, return null
      return null;
    }
  } catch (error) {
    // *************** If an error occurs while loading the block, throw an ApolloError
    throw new ApolloError(`Failed to load block: ${error.message}`, 'BLOCK_FETCH_FAILED');
  }
}

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
    GetAllSubjects,
    GetOneSubject
  },
  Mutation: {
    CreateSubject,
    UpdateSubject,
    DeleteSubject
  },
  Block: {
    test: TestLoader,
    block: BlockLoader,
    created_by: CreatedByLoader,
    updated_by: UpdatedByLoader,
    deleted_by: DeletedByLoader
  }
};