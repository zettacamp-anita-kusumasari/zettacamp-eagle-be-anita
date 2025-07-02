// *************** IMPORT MODULE ***************
const TestModel = require('./Test.model');

// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Mongoose = require('mongoose');

// *************** IMPORT VALIDATOR ***************
const { ValidateTestInput } = require('./Test.validator');

// *************** QUERY ***************
async function GetAllTests() {
    try {
        // *************** Try to fetch all tests where status is TO_DO
        const activeTests = await TestModel.find({ test_status: 'TO_DO' });
        return activeTests;
    } catch (error) {
        // *************** If an error occurs, throw an ApolloError with a message and error code
        throw new ApolloError(`Failed to fetch tests: ${error.message}`, "INTERNAL_SERVER_ERROR");
    }
}

async function GetOneTest(_, { id }) {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    try {
        // *************** Try to find a subject data that has ACTIVE status by its mongoDB ObjectId
        const test = await TestModel.findOne({ _id: id, test_status: 'TO_DO' });
        // *************** If no test is found, throw a NOT FOUND error
        if (!test) {
        throw new ApolloError("Test not found", "NOT_FOUND");
        }
        // *************** If the system is successful, then return the fetched test data
        return test;
    } catch (error) {
        // *************** If an error occurs during the query, throw an ApolloError
        throw new ApolloError(`Failed to fetch test: ${error.message}`, "INTERNAL_SERVER_ERROR");
    }
}

// *************** MUTATION ***************
async function CreateTest(_, { input }) {
    try {
        // *************** Set the ID of the user who is creating the test
        const userId = '6846e5769e5502fce150eb67';
        // *************** Destructure the necessary fields from the input object
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
        // *************** (Map input fields to database schema) Construct a new test data object with properly structured fields
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
        // *************** Save the test data to the database using Mongoose
        const toCreatedTest = await TestModel.create(testData);
        return toCreatedTest;
    } catch (error) {
        // *************** If an error occurs during the query, throw an ApolloError
        throw new ApolloError('Failed to create test:', 'TEST_CREATION_FAILED', {error: error.message});
    }
}

async function PublishTest(_, { id }) {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        throw new ApolloError(`Invalid ID: ${id}`, 'BAD_USER_INPUT');
    }

    try {
        // *************** Set the ID of the user who is publishing the test
        const userId = '6846e5769e5502fce150eb67';

        // *************** Find test by ID
        const test = await TestModel.findById(id);
        if (!test) {
            throw new ApolloError('Test not found.', 'NOT_FOUND');
        }

        // *************** Update status to FINISHED and set published info
        test.test_status = 'FINISHED';
        test.published_by = userId;
        test.published_date = new Date();

        // *************** Save and return updated test
        const updatedTest = await test.save();
        return updatedTest;
    } catch (error) {
        throw new ApolloError('Failed to publish test.', 'TEST_PUBLISH_FAILED', { error: error.message });
    }
}

async function UpdateTest(_, { id, input }) {
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

async function DeleteTest(_, { id }) {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
        throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    try {
        // *************** Find the test by ID and check its current status
        const test = await TestModel.findOne({ _id: id, test_status: 'TO_DO' });
        if (!test) {
        // *************** If no subject found with the ID, throw an error
        throw new ApolloError("Test not found or already completed", "NOT_FOUND");
        }
        // *************** Set the user ID who is performing the deletion
        const userId = '6846e5769e5502fce150eb67';
        // *************** Update for soft delete
        const toUpdatedTest = await TestModel.findOneAndUpdate({ _id: id },{
            test_status: 'FINISHED',
            deleted_by: userId,
            deleted_at: new Date()
        });
        return toUpdatedTest;
    } catch (error) {
        // *************** If an error occurs during the update, throw an ApolloError with details
        throw new ApolloError('Failed to delete test:', 'TEST_DELETION_FAILED', {error: error.message});
    }
}

// *************** LOADER ***************

// Load Multiple Student Test Result Documents in the Test Model
async function StudentTestResultLoader(parent, _, context) {
  try {
    // *************** Use the StudentTestResultLoader to load many student test result documents by its ID
    const toStudentTestResultList = await context.dataLoaders.StudentTestResultLoader.loadMany(parent.studentTestResults);
    // *************** Return the loaded student test result documents
    return toStudentTestResultList;
  } catch (error) {
    // *************** If an error occurs during loading the student test results, throw an ApolloError
    throw new ApolloError(`Failed to load student test results: ${error.message}`, 'STUDENT_TEST_RESULT_FETCH_FAILED');
  }
}

// Load multiple Task documents in the Test Model
async function TaskLoader(parent, _, context) {
  try {
    // *************** Use the TaskLoader to load many task documents by its ID
    const toTaskList = await context.dataLoaders.TaskLoader.loadMany(parent.tasks);
    // *************** Return the loaded task documents
    return toTaskList;
  } catch (error) {
    // *************** If an error occurs during loading the tasks, throw an ApolloError
    throw new ApolloError(`Failed to load tasks: ${error.message}`, 'TASK_FETCH_FAILED');
  }
}

// Load one Subject Document in the Test Model
async function SubjectLoader(parent, _, context) {
  try {
    // *************** Check if parent.subject_id exists
    if (parent.subject_id) {
      // *************** Use the SubjectLoader to fetch subject document by its ID
      const toLoadedSubject = await context.dataLoaders.SubjectLoader.load(parent.subject_id);
      // *************** Return the loaded subject document
      return toLoadedSubject;
    } else {
      // *************** If no subject_id is present in the parent object, return null
      return null;
    }
  } catch (error) {
    // *************** If an error occurs while loading the subject, throw an ApolloError
    throw new ApolloError(`Failed to load subject: ${error.message}`, 'SUBJECT_FETCH_FAILED');
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
    GetAllTests,
    GetOneTest
  },
  Mutation: {
    CreateTest,
    PublishTest,
    UpdateTest,
    DeleteTest
  },
  Block: {
    student_test_result: StudentTestResultLoader,
    task: TaskLoader,
    created_by: CreatedByLoader,
    updated_by: UpdatedByLoader,
    deleted_by: DeletedByLoader
  }
};