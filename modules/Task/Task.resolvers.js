// *************** IMPORT MODULE ***************
const TaskModel = require('./Task.model');
const StudentTestResultModel = require('../StudentTestResult/StudentTestResult.model');

// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Mongoose = require('mongoose');

// *************** IMPORT VALIDATOR ***************
const { ValidateMarksInput } = require('./Task.validator');

// *************** QUERY ***************
async function GetTasksByUser(_, { user_id }) {
    // *************** Validate the provided user ID
    if (!Mongoose.Types.ObjectId.isValid(user_id)) {
        throw new ApolloError(`Invalid user ID: ${user_id}`, 'BAD_USER_INPUT');
    }
    try {
        // *************** Find all tasks assigned to the specified user
        const tasks = await TaskModel.find({ user_id });
        // *************** If no tasks found, throw a NOT FOUND error
        if (!tasks || tasks.length === 0) {
            throw new ApolloError("No tasks found for this user", "NOT_FOUND");
        }
        // *************** Return the list of tasks found
        return tasks;
    } catch (error) {
        // *************** Handle unexpected errors during the query
        throw new ApolloError(`Failed to fetch tasks: ${error.message}`, "INTERNAL_SERVER_ERROR");
    }
}

async function GetTasksByTest(_, { test_id }) {
    // *************** Validate the provided test ID
    if (!Mongoose.Types.ObjectId.isValid(test_id)) {
        throw new ApolloError(`Invalid test ID: ${test_id}`, 'BAD_USER_INPUT');
    }
    try {
        // *************** Find all tasks related to the specified test
        const tasks = await TaskModel.find({ test_id });
        // *************** If no tasks are found, throw a NOT FOUND error
        if (!tasks || tasks.length === 0) {
            throw new ApolloError("No tasks found for this test", "NOT_FOUND");
        }
        // *************** Return the list of tasks found
        return tasks;
    } catch (error) {
        // *************** Handle unexpected errors during the query
        throw new ApolloError(`Failed to fetch tasks: ${error.message}`, "INTERNAL_SERVER_ERROR");
    }
}

// *************** MUTATION ***************

async function AssignCorrector(_, { input }, context) {
      const { task_id, corrector_id } = input;

      if (!Mongoose.Types.ObjectId.isValid(task_id) || !Mongoose.Types.ObjectId.isValid(corrector_id)) {
        throw new ApolloError('Invalid task_id or corrector_id', 'BAD_USER_INPUT');
      }

      const task = await TaskModel.findById(task_id);
      if (!task) {
        throw new ApolloError('Task not found', 'NOT_FOUND');
      }

      // Update assign task to completed
      task.task_status = 'COMPLETED';
      await task.save();

      // Create new task: ENTER_MARKS
      const newTask = new TaskModel({
        test_id: task.test_id,
        user_id: corrector_id,
        task_type: 'Enter_Marks',
        task_status: 'PENDING',
        due_date: new Date(new Date().setHours(0, 0, 0, 0) + 3 * 86400000),
        created_by: context?.user?.id,
      });
      await newTask.save();

      return newTask;
}

async function EnterMarks(_, { input }, context) {
    const { test_id, student_id, marks, academic_director_id } = input;
    ValidateMarksInput(marks);

    if (!Mongoose.Types.ObjectId.isValid(test_id) || !Mongoose.Types.ObjectId.isValid(student_id)) {
        throw new ApolloError('Invalid test_id or student_id', 'BAD_USER_INPUT');
    }

    const existing = await StudentTestResultModel.findOne({ test_id, student_id });
    if (existing) {
        throw new ApolloError('Marks already entered for this student and test.', 'DUPLICATE_ENTRY');
    }

    const total = marks.reduce((sum, entry) => sum + entry.mark, 0);
    const average = total / marks.length;

    const result = new StudentTestResultModel({
        test_id,
        student_id,
        marks,
        average_mark: average,
        mark_entry_date: new Date(),
    });
    
    await result.save();

    // Update task status
    await TaskModel.findOneAndUpdate(
        { test_id, task_type: 'Enter_Marks', user_id: context?.user?.id },
        { task_status: 'COMPLETED' }
    );

    // Create validate task
    const validateTask = new TaskModel({
        test_id,
        user_id: academic_director_id || context?.user?.id,
        task_type: 'Validate_Marks',
        task_status: 'PENDING',
        due_date: new Date(new Date().setHours(0, 0, 0, 0) + 3 * 86400000),
        created_by: context?.user?.id,
    });
    await validateTask.save();

    return result;
}

async function ValidateMarks(_, { input }, context) {
    const { task_id } = input;

    if (!Mongoose.Types.ObjectId.isValid(task_id)) {
        throw new ApolloError('Invalid task_id', 'BAD_USER_INPUT');
    }

    const task = await TaskModel.findById(task_id);
    if (!task) {
        throw new ApolloError('Task not found', 'NOT_FOUND');
    }

    task.task_status = 'COMPLETED';
    await task.save();

    return task;
}

// *************** LOADER ***************

// Load one Test Document in the Task Model
async function TestLoader(parent, _, context) {
  try {
    // *************** Check if parent.test_id exists
    if (parent.test_id) {
      // *************** Use the TestLoader to fetch test document by its ID
      const toLoadedTest = await context.dataLoaders.TestLoader.load(parent.test_id);
      // *************** Return the loaded test document
      return toLoadedTest;
    } else {
      // *************** If no test_id is present in the parent object, return null
      return null;
    }
  } catch (error) {
    // *************** If an error occurs while loading the test, throw an ApolloError
    throw new ApolloError(`Failed to load test: ${error.message}`, 'TEST_FETCH_FAILED');
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
    GetTasksByUser,
    GetTasksByTest
  },
  Mutation: {
    AssignCorrector,
    EnterMarks,
    ValidateMarks
  },
  Task: {
    test: TestLoader,
    created_by: CreatedByLoader,
    updated_by: UpdatedByLoader,
    deleted_by: DeletedByLoader
  }
};