// *************** IMPORT LIBRARY ***************
const { ApolloError } = require("apollo-server");
const Validator = require("validator");
const Mongoose = require("mongoose");

// *************** Valid status for test_type
const ValidType = ["ASSIGN_CORRECTOR", "ENTER_MARKS", "VALIDATE_MARKS"];
// *************** Valid status for test_status
const ValidStatus = ["PENDING", "IN_PROGRESS", "COMPLETED", "DELETED"];

/**
 * Validates the input object for creating or updating a Task entity.
 *
 * This function checks required fields such as `task_type`, `task_status`, `due_date`, and `user_id`.
 * It throws an ApolloError if any validation fails, with a descriptive message and field reference.
 *
 * @param {Object} input - The input object containing fields to validate.
 * @param {string} input.task_type - The type of task (required, must be one of ValidType).
 * @param {string} input.task_status - The status of the task (required, must be one of ValidStatus).
 * @param {string|Date} input.due_date - The due date for the task (required, must be a valid date).
 * @param {string} input.user_id - The ID of the user creating the task (required, non-empty string).
 *
 * @throws {ApolloError} - Throws error if any field fails validation, with code 'BAD_USER_INPUT' and field metadata.
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
  // *************** Validate that task status exists and is within the allowed values ('PENDING', 'IN_PROGRESS', 'DELETED')
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
