// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Mongoose = require("mongoose");
require("dotenv").config();
const SendGridMail = require("@sendgrid/mail");

// *************** IMPORT MODULE ***************
const UserModel = require("../User/User.model");
const StudentModel = require("../Student/Student.model");
const SubjectModel = require("../Subject/Subject.model");
const TestModel = require("../Test/Test.model");
const StudentTestResultModel = require("../StudentTestResult/StudentTestResult.model");
const TaskModel = require("./Task.model");

// *************** IMPORT VALIDATOR ***************
const { ValidateTaskInput } = require("./Task.validator");
const { text } = require("express");

// *************** QUERY ***************
/**
 * Query resolver to retrieve all tasks with specific types and statuses.
 *
 * @returns {Promise<Array<Object>>} - Returns a list of matching task documents.
 * @throws {ApolloError} - Throws an error if the database query fails.
 */
async function GetAllTasks() {
  try {
    // *************** Try to fetch all tasks where type is ASSIGN_CORRECTOR, ENTER_MARK, and VALIDATE_MARKS
    const tasks = await TaskModel.find({
      task_type: { $in: ["ASSIGN_CORRECTOR", "ENTER_MARKS", "VALIDATE_MARKS"] },
      task_status: { $in: ["PENDING", "IN_PROGRESS", "COMPLETED"] },
    }).lean();
    // *************** Return the conditions to get all the tasks
    return tasks;
  } catch (error) {
    // *************** If an error occurs, throw an ApolloError with a message and error code
    throw new ApolloError(
      `Failed to fetch tests: ${error.message}`,
      "INTERNAL_SERVER_ERROR"
    );
  }
}

/**
 * Retrieves a single task by its ID.
 *
 * @async
 * @function GetOneTask
 * @param {Object} _ - Unused root argument from GraphQL resolver.
 * @param {Object} args - Arguments containing the task ID.
 * @param {string} args.id - The ID of the task to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the task document if found.
 * @throws {ApolloError} - Throws an error if the ID is invalid, the task is not found, or an unexpected error occurs.
 */
async function GetOneTask(_, { id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Try to find the task with the given ID
    const task = await TaskModel.findOne({ _id: id }).lean();
    // *************** If not found, throw a NOT_FOUND error
    if (!task) {
      throw new ApolloError("Task not found", "NOT_FOUND");
    }
    // *************** Return the found task
    return task;
  } catch (error) {
    // *************** If any unexpected error occurs, throw Apollo Error with error code and message
    throw new ApolloError("Failed to retrieve task", "GET_TASK_FAILED", {
      error: error.message,
    });
  }
}

// *************** MUTATION ***************
/**
 * Mutation resolver to update an existing Task document in the database.
 *
 * This function validates the task ID and input fields, maps them to the database schema,
 * and updates the corresponding task document using Mongoose.
 *
 * @param {Object} _ - GraphQL root object (not used).
 * @param {Object} args - Arguments object.
 * @param {string} args.id - The MongoDB ObjectId of the task to update.
 * @param {Object} args.input - The input fields used to update the task.
 * @param {string} args.input.task_type - The type of task (e.g. "ENTER_MARKS", "VALIDATE_MARKS").
 * @param {string} args.input.task_status - The status of the task (e.g. "PENDING", "IN_PROGRESS", "COMPLETED").
 * @param {string|Date} args.input.due_date - The due date of the task.
 * @returns {Promise<Object>} - Returns the updated task document.
 * @throws {ApolloError} - Throws error if validation fails or update operation fails.
 */
async function UpdateTask(_, { id, input }) {
  try {
    // *************** Check if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      throw new ApolloError(`Invalid ID: ${id}`, "BAD_USER_INPUT");
    }
    // *************** Destructure necessary fields from the input object
    const { task_type, task_status, due_date } = input;
    // *************** Validate the input using exported function ValidateTestInput
    ValidateTaskInput(input);
    // *************** (Map input fields to database schema) Construct a new block data object to be used for update
    const taskData = {
      task_type: task_type,
      task_status: task_status.toUpperCase(),
      due_date: due_date,
    };
    // *************** Perform the update in the database and return the updated document
    const toUpdatedTask = await TaskModel.findByIdAndUpdate(
      id,
      { $set: taskData },
      { new: true }
    ).lean();
    return toUpdatedTask;
  } catch (error) {
    // *************** If an error occurs during the update, throw an ApolloError with details
    throw new ApolloError("Failed to update task:", "TASK_UPDATE_FAILED", {
      error: error.message,
    });
  }
}

/**
 * Assigns a corrector to a test by updating the ASSIGN_CORRECTOR task,
 * creating an ENTER_MARKS task, and sending a notification email.
 *
 * @param {Object} _ - Parent resolver (not used)
 * @param {Object} args - Arguments containing task ID and user ID
 * @param {String} args._id - ID of the ASSIGN_CORRECTOR task
 * @returns {Promise<Object>} - The created ENTER_MARKS task
 */
async function AssignCorrector(_, { _id }, context) {
  try {
    // *************** Check if the given ID is a valid mongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid task ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Find the ASSIGN_CORRECTOR task
    const task = await TaskModel.findOne({
      _id,
      task_type: "ASSIGN_CORRECTOR",
      task_status: "PENDING",
    });
    // *************** if the task isn't exist, throw Apollo Error with error message
    if (!task) {
      throw new ApolloError("Task not found.", "NOT_FOUND");
    }
    // *************** Update the ASSIGN_CORRECTOR task
    await TaskModel.updateOne(
      { _id },
      {
        task_status: "COMPLETED",
      }
    );
    // *************** Create ENTER_MARK task
    const enterMarks = await TaskModel.create({
      test_id: task.test_id,
      task_type: "ENTER_MARKS",
      task_status: "PENDING",
      due_date: new Date(new Date().setHours(0, 0, 0, 0) + 3 * 86400000),
    });
    // *************** Get related test_id
    const test = await TestModel.findById(task.test_id).lean();
    // *************** Get related subject_id
    const subject = await SubjectModel.findById(test.subject_id).lean();
    // *************** Get student document
    const studentDocs = await StudentModel.find({
      _id: { $in: test.student_ids || [] },
    }).lean();
    // *************** Get student names (assuming test.student_ids exists)
    const studentNames =
      studentDocs.map((s) => `${s.first_name} ${s.last_name}`).join(", ") ||
      "No students assigned.";
    // *************** Set your SendGrid API key
    SendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
    // *************** Define the email message
    const message = {
      to: "akusumasari111@gmail.com",
      from: "raikusuma111@gmail.com",
      subject: "You have been assigned as a Test Corrector!",
      text: `You have been assigned to correct a test.
      Test Name: ${test.name}
      Subject: ${subject?.name || "-"}
      Description: ${test.description || "-"}
      Students: ${studentNames}`,
      html: `<p>You have been assigned to correct a test.</p>
      <ul>
        <li><strong>Test Name:</strong> ${test.name}</li>
        <li><strong>Subject:</strong> ${subject?.name || "-"}</li>
        <li><strong>Description:</strong> ${test.description || "-"}</li>
        <li><strong>Students:</strong> ${studentNames}</li>
      </ul>`,
    };
    // *************** Function to send the email
    async function sendEmail() {
      try {
        await SendGridMail.send(message);
        console.log("Email sent successfully!");
      } catch (error) {
        console.error("Error sending email:", error);
        if (error.response) {
          console.error(error.response.body);
        }
      }
    }
    // *************** Call the function to send the email
    sendEmail();
    // *************** Return the created task
    return enterMarks;
  } catch (error) {
    throw new ApolloError(
      "Failed to assign corrector.",
      "ASSIGN_CORRECTOR_FAILED",
      {
        error: error.message,
      }
    );
  }
}

/**
 * Enters marks for a student's test result.
 *
 * @param {Object} _ - Parent resolver (not used)
 * @param {Object} args - Contains task _id and input data
 * @param {String} args._id - ID of the ENTER_MARKS task
 * @param {Object} args.input - Input data including test_id, student_id, and marks
 * @returns {Promise<Object>} - The created VALIDATE_MARKS task
 */
async function EnterMarks(_, { _id, input }, context) {
  try {
    const { marks, test_id, student_id } = input;
    // *************** Validate the _id
    if (!Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid task ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Validate the test_id
    if (!Mongoose.Types.ObjectId.isValid(test_id)) {
      throw new ApolloError(`Invalid test ID: ${test_id}`, "BAD_USER_INPUT");
    }
    // *************** Validate the student_id
    if (!Mongoose.Types.ObjectId.isValid(student_id)) {
      throw new ApolloError(
        `Invalid student ID: ${student_id}`,
        "BAD_USER_INPUT"
      );
    }
    // *************** Check for duplicate student-test result
    const existing = await StudentTestResultModel.findOne({
      test_id,
      student_id,
    }).lean();
    if (existing) {
      throw new ApolloError(
        "Marks already entered for this student and test.",
        "DUPLICATE_ENTRY"
      );
    }
    // *************** Group and calculate average per notation
    const grouped = {};
    marks.forEach(({ notation_text, mark }) => {
      if (!grouped[notation_text]) {
        grouped[notation_text] = { total: 0, count: 0 };
      }
      grouped[notation_text].total += mark;
      grouped[notation_text].count += 1;
    });
    // *************** Calculate the average mark per notation
    const averageMarksPerNotation = Object.entries(grouped).map(
      ([notation_text, { total, count }]) => ({
        notation_text,
        average_mark: parseFloat((total / count).toFixed(2)),
      })
    );
    // *************** Calculate overall average
    const totalMarks = marks.reduce((sum, entry) => sum + entry.mark, 0);
    const overallAverage = parseFloat((totalMarks / marks.length).toFixed(2));
    // *************** Save the student test result
    await StudentTestResultModel.create({
      test_id,
      student_id,
      marks,
      average_mark: overallAverage,
      average_marks: averageMarksPerNotation,
      mark_entry_date: new Date(),
    });
    // *************** Update the Test Model
    await TestModel.updateOne(
      { _id: test_id },
      { $push: { student_test_result_ids: createdResult._id } }
    );
    // *************** Find the ENTER_MARKS task
    const task = await TaskModel.findOne({
      _id,
      task_type: "ENTER_MARKS",
      task_status: "PENDING",
    });
    // *************** If task is not exist, then throw apollo error
    if (!task) {
      throw new ApolloError("Task not found.", "NOT_FOUND");
    }
    // *************** Mark the ENTER_MARKS task as COMPLETED
    await TaskModel.updateOne({ _id }, { task_status: "COMPLETED" });
    // *************** Create a VALIDATE_MARKS task
    const validateMarksTask = await TaskModel.create({
      test_id: task.test_id,
      task_type: "VALIDATE_MARKS",
      task_status: "PENDING",
      due_date: new Date(new Date().setHours(0, 0, 0, 0) + 3 * 86400000),
      created_at: new Date(),
    });
    // *************** return the validateMarksTask
    return validateMarksTask;
  } catch (error) {
    // *************** If an error occur, throw apollo error
    throw new ApolloError("Failed to enter marks.", "ENTER_MARKS_FAILED", {
      error: error.message,
    });
  }
}

/**
 * Mutation resolver to validate marks by completing a `VALIDATE_MARKS` type task.
 *
 * This function verifies the task ID, ensures the task exists with `PENDING` status and type `VALIDATE_MARKS`,
 * updates its status to `COMPLETED`, and saves it back to the database.
 *
 * @param {Object} _ - Unused GraphQL root object (parent resolver).
 * @param {Object} args - Arguments object containing the task ID.
 * @param {string} args._id - The ID of the task to validate.
 * @param {Object} context - GraphQL context object, not used directly here but included for consistency.
 * @returns {Promise<Object>} - Returns the updated task document with status set to `COMPLETED`.
 * @throws {ApolloError} - Throws error if ID is invalid or task is not found or already completed.
 */
async function ValidateMarks(_, { _id }, context) {
  // *************** Check if the given ID is a valid MongoDB ObjectId
  if (!Mongoose.Types.ObjectId.isValid(_id)) {
    throw new ApolloError("Invalid task_id", "BAD_USER_INPUT");
  }
  // *************** Find the valid task
  const task = await TaskModel.findOne({
    _id,
    task_type: "VALIDATE_MARKS",
    task_status: "PENDING",
  });
  // *************** If the task is not found then throw Apollo Error
  if (!task) {
    throw new ApolloError("Task not found.", "NOT_FOUND");
  }
  // *************** Update status to COMPLETED
  task.task_status = "COMPLETED";
  // *************** Save the updated task to database
  await task.save();
  // *************** return to the updated task
  return task;
}

/**
 * Mutation resolver to soft delete a Task by setting its status to "DELETED".
 *
 * This function validates the input ID, ensures the task exists with a valid status (`PENDING`, `IN_PROGRESS`, or `COMPLETED`),
 * and then performs a soft delete by updating the task status to `DELETED` and adding a `deleted_at` timestamp.
 *
 * @param {Object} _ - GraphQL root object (not used).
 * @param {Object} args - Arguments object containing the task ID.
 * @param {string} args._id - The MongoDB ObjectId of the task to delete.
 * @returns {Promise<string>} - Returns the ID of the deleted task if successful.
 * @throws {ApolloError} - Throws error if the ID is invalid, task not found, or deletion fails.
 */
async function DeleteTask(_, { _id }) {
  try {
    // *************** Validate if the provided ID is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApolloError(`Invalid ID: ${_id}`, "BAD_USER_INPUT");
    }
    // *************** Check if the task exists and PENDING and IN_PROGRESS status
    const existingTask = await TaskModel.exists({
      _id: _id,
      task_status: { $in: ["PENDING", "IN_PROGRESS", "COMPLETED"] },
    }).lean();
    // *************** If task is not found or already deleted, throw an error
    if (!existingTask) {
      throw new ApolloError("Task not found or already deleted", "NOT_FOUND");
    }

    // *************** Soft delete: update task_status and set deleted_at timestamp
    await TaskModel.updateOne(
      { _id: _id },
      {
        task_status: "DELETED",
        deleted_at: new Date(),
      }
    );
    return _id;
    // *************** If an error occurs during the update, throw an ApolloError with details
  } catch (error) {
    throw new ApolloError("Failed to delete task", "TASK_DELETION_FAILED", {
      error: error.message,
    });
  }
}

// *************** LOADER ***************
/**
 * Field resolver to load multiple StudentTestResult documents by their IDs.
 *
 * @param {Object} parent - The parent object that contains the `student_test_result_ids` array.
 * @param {Object} _ - Unused GraphQL args.
 * @param {Object} context - The GraphQL context containing the `studentTestResultLoader`.
 * @returns {Promise<Array<Object>>} - Returns an array of StudentTestResult documents.
 */
async function student_test_result_ids(parent, _, context) {
  // *************** Check if parent.test_id exists
  if (!parent.student_test_result_ids) {
    // *************** If no test_id is present in the parent object, return null
    return [];
  }
  // *************** Use the TestLoader to load many test documents by its ID
  const toStudentTestResultList =
    await context.studentTestResultLoader.loadMany(
      parent.student_test_result_ids
    );
  // *************** Return the loaded test documents
  return toStudentTestResultList;
}

/**
 * Field resolver to load a Student document by its ID.
 *
 * @param {Object} parent - The parent object that contains the `student_id` field.
 * @param {Object} _ - Unused GraphQL args.
 * @param {Object} context - The GraphQL context containing the `studentLoader`.
 * @returns {Promise<Object|null>} - Returns the Student document or null if not found.
 */
async function student_id(parent, _, context) {
  // *************** Check if parent.student_id exists
  if (!parent.student_id) {
    // *************** If no student_id is present in the parent object, return null
    return null;
  }
  // *************** Use the StudentLoader to fetch student document by its ID
  const toLoadedStudent = await context.studentLoader.load(parent.student_id);
  // *************** Return the loaded student document
  return toLoadedStudent;
}

/**
 * Field resolver to load a Test document by its ID.
 *
 * @param {Object} parent - The parent object that contains the `test_id` field.
 * @param {Object} _ - Unused GraphQL args.
 * @param {Object} context - The GraphQL context containing the `testLoader`.
 * @returns {Promise<Object|null>} - Returns the Test document or null if not found.
 */
async function test_id(parent, _, context) {
  // *************** Check if parent.test_id exists
  if (!parent.test_id) {
    // *************** If no test_id is present in the parent object, return null
    return null;
  }
  // *************** Use the TestLoader to fetch test document by its ID
  const toLoadedTest = await context.testLoader.load(parent.test_id);
  // *************** Return the loaded test document
  return toLoadedTest;
}

/**
 * Resolver for fetching the User document associated with the `created_by` field in a StudentTestResult.
 *
 * @param {Object} parent - The parent StudentTestResult object.
 * @param {string} parent.created_by - The ID of the user who created the student test result.
 * @param {any} _ - Unused GraphQL resolver argument (args).
 * @param {Object} context - GraphQL context containing DataLoaders.
 * @param {Object} context.dataLoaders - A collection of DataLoader instances.
 * @param {DataLoader<string, Object|null>} context.dataLoaders.UserLoader - DataLoader to fetch User documents.
 * @returns {Promise<Object|null>} The corresponding User document, or null if `created_by` is not present.
 */
async function created_by(parent, _, context) {
  // *************** Check if the parent object contains the created_by user ID
  if (!parent.created_by) {
    // *************** If created_by is not present, return null (no user to load)
    return null;
  }
  // *************** Use the UserLoader to load the user document based on parent.created_by ID
  const toCreatedByUser = await context.userLoader.load(parent.created_by);
  // *************** Return the loaded user document
  return toCreatedByUser;
}

/**
 * Resolver for fetching the User document associated with the `updated_by` field in a StudentTestResult.
 *
 * @param {Object} parent - The parent StudentTestResult object.
 * @param {string} parent.updated_by - The ID of the user who last updated the student test result.
 * @param {any} _ - Unused GraphQL resolver argument (args).
 * @param {Object} context - GraphQL context containing DataLoaders.
 * @param {Object} context.dataLoaders - A collection of DataLoader instances.
 * @param {DataLoader<string, Object|null>} context.dataLoaders.UserLoader - DataLoader to fetch User documents.
 * @returns {Promise<Object|null>} The corresponding User document, or null if `updated_by` is not present.
 */
async function updated_by(parent, _, context) {
  // *************** Check if the parent object contains the updated_by user ID
  if (!parent.updated_by) {
    // *************** If updated_by is not present, return null (no user to load)
    return null;
  }
  // *************** Use the UserLoader to load the user document based on parent.updated_by ID
  const toUpdatedByUser = await context.userLoader.load(parent.updated_by);
  // *************** Return the loaded user document
  return toUpdatedByUser;
}

/**
 * Resolver for fetching the User document associated with the `deleted_by` field in a StudentTestResult.
 *
 * @param {Object} parent - The parent StudentTestResult object.
 * @param {string} parent.deleted_by - The ID of the user who deleted the student test result.
 * @param {any} _ - Unused GraphQL resolver argument (args).
 * @param {Object} context - GraphQL context containing DataLoaders.
 * @param {Object} context.dataLoaders - A collection of DataLoader instances.
 * @param {DataLoader<string, Object|null>} context.dataLoaders.UserLoader - DataLoader to fetch User documents.
 * @returns {Promise<Object|null>} The corresponding User document, or null if `deleted_by` is not present.
 */
async function deleted_by(parent, _, context) {
  // *************** Check if the parent object contains the deleted_by user ID
  if (!parent.deleted_by) {
    // *************** If deleted_by is not present, return null (no user to load)
    return null;
  }
  // *************** Use the UserLoader to load the user document based on parent.deleted_by ID
  const toDeletedByUser = await context.userLoader.load(parent.deleted_by);
  // *************** Return the loaded user document
  return toDeletedByUser;
}

// *************** EXPORT MODULE ***************
module.exports = {
  Query: {
    GetAllTasks,
    GetOneTask,
  },
  Mutation: {
    UpdateTask,
    AssignCorrector,
    EnterMarks,
    ValidateMarks,
    DeleteTask,
  },
  Task: {
    student_test_result_ids,
    student_id,
    test_id,
    created_by,
    updated_by,
    deleted_by,
  },
};
