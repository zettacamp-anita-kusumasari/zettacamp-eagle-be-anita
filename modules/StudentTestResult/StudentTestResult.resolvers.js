// *************** IMPORT MODULE ***************
const StudentTestResultModel = require('./StudentTestResult.model');

// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Mongoose = require('mongoose');

// *************** IMPORT VALIDATOR ***************
const { ValidateStudentTestResultInput } = require('./StudentTestResult.validator');

// *************** QUERY ***************
async function GetAllStudentTestResults() {
    try {
        // *************** Try to fetch all student test results where status is GRADED
        const activeStudentTestResults = await StudentTestResultModel.find({ student_test_result_status: 'GRADED' });
        return activeStudentTestResults;
    } catch (error) {
        // *************** If an error occurs, throw an ApolloError with a message and error code
        throw new ApolloError(`Failed to fetch tests: ${error.message}`, "INTERNAL_SERVER_ERROR");
    }
}

async function GetOneStudentTestResult(_, { id }) {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    try {
        // *************** Try to find a student test result data that has GRADED status by its mongoDB ObjectId
        const studentTestResult = await StudentTestResultModel.findOne({ _id: id, test_status: 'GRADED' });
        // *************** If no student test result is found, throw a NOT FOUND error
        if (!studentTestResult) {
        throw new ApolloError("Student Test Result not found", "NOT_FOUND");
        }
        // *************** If the system is successful, then return the fetched student test result
        return studentTestResult;
    } catch (error) {
        // *************** If an error occurs during the query, throw an ApolloError
        throw new ApolloError(`Failed to fetch test: ${error.message}`, "INTERNAL_SERVER_ERROR");
    }
}

async function UpdateStudentTestResult(_, { id, input }) {
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
            weight,
            notations,
            test_status,
            for_retake,
            corrector,
            published_date
        } = input;
        // *************** Validate the input using exported function ValidateTestInput
        ValidateTestInput(input);
        // *************** (Map input fields to database schema) Construct a new block data object to be used for update
        const testData = {
            name: name,
            description: description,
            weight: weight,
            notations: notations.map(function(n) {
                return {
                    notation_text: n.notation_text,
                    max_point: n.max_point
                };
            }),
            test_status: test_status.toUpperCase(),
            for_retake: for_retake,
            corrector: corrector,
            published_date: published_date,
            created_by: userId
        };
        // *************** Perform the update in the database and return the updated document
        const toUpdatedTest = await TestModel.findOneAndUpdate({ _id: id }, testData, { new: true });
        return toUpdatedTest;
    } catch (error) {
        // *************** If an error occurs during the update, throw an ApolloError with details
        throw new ApolloError('Failed to update test:', 'TEST_UPDATE_FAILED', {error: error.message});
    }
}

async function DeleteStudentTestResult(_, { id }) {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    try {
        // *************** Find the student test result by ID and check its current status
        const studentTestResult = await StudentTestResultModel.findOne({ _id: id, student_test_result_status: 'IN_PROGRESS' | 'GRADED'});
        if (!studentTestResult) {
        // *************** If no student test result found with the ID, throw an error
        throw new ApolloError("Student Test Result not found or already deleted", "NOT_FOUND");
        }
        // *************** Set the user ID who is performing the deletion
        const userId = '6846e5769e5502fce150eb67';
        // *************** Update for soft delete
        const toUpdatedStudentTestResult = await StudentTestResultModel.findOneAndUpdate({ _id: id },{
            student_test_result_status: 'DELETED',
            deleted_by: userId,
            deleted_at: new Date()
        });
        return toUpdatedStudentTestResult;
    } catch (error) {
        // *************** If an error occurs during the update, throw an ApolloError with details
        throw new ApolloError('Failed to delete student test result:', 'STUDENT_TEST_RESULT_DELETION_FAILED', {error: error.message});
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
    GetAllStudentTestResults,
    GetOneStudentTestResult
  },
  Mutation: {
    UpdateStudentTestResult,
    DeleteStudentTestResult
  },
  Block: {
    created_by: CreatedByLoader,
    updated_by: UpdatedByLoader,
    deleted_by: DeletedByLoader
  }
};