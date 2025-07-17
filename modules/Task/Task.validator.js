// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Validator = require("validator");
const Mongoose = require("mongoose");

// *************** GLOBAL VARIABLE ***************
const ValidType = ["ASSIGN_CORRECTOR", "ENTER_MARKS", "VALIDATE_MARKS"];
const ValidStatus = ["PENDING", "COMPLETED", "DELETED"];

/**
 * Validates the input object for creating or updating a Task.
 *
 * This function checks:
 * - That `task_type` exists and is one of the allowed values.
 * - That `task_status` exists and is one of the allowed values.
 * - That `due_date` is a valid date.
 *
 * @function ValidateTaskInput
 * @param {Object} input - The input object to validate.
 * @param {string} input.task_type - The type of task (e.g., 'ASSIGN_CORRECTOR', 'ENTER_MARKS', 'VALIDATE_MARKS').
 * @param {string} input.task_status - The status of the task (e.g., 'PENDING', 'COMPLETED', 'DELETED').
 * @param {string|Date} input.due_date - The due date for the task (must be a valid date).
 * @throws {ApolloError} Throws an ApolloError if validation fails.
 */
function ValidateTaskInput(input) {
  // *************** Destructure expected fields from the input object
  const { task_type, task_status, due_date } = input;
  // *************** Validate that task type exists and is within the allowed values ('Assign_Corrector', 'Enter_Marks', 'Validate_Marks')
  if (!task_type || !ValidType.includes(task_type)) {
    throw new ApolloError(
      `Task type must be one of: ${ValidType.join(", ")}.`,
      "BAD_USER_INPUT",
      { field: "task_type" }
    );
  }
  // *************** Validate that task status exists and is within the allowed values ('PENDING', 'COMPLETED', 'DELETED')
  if (!task_status || !ValidStatus.includes(task_status.toUpperCase())) {
    throw new ApolloError(
      `Task status must be one of: ${ValidStatus.join(", ")}.`,
      "BAD_USER_INPUT",
      { field: "task_status" }
    );
  }
  // *************** Validate that published_date is provided
  if (!due_date || isNaN(new Date(due_date).getTime())) {
    throw new ApolloError(
      "Due Date is required and must be a valid date.",
      "BAD_USER_INPUT",
      { field: "due_date" }
    );
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  ValidateTaskInput,
};
