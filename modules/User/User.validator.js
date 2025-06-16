// *************** IMPORT LIBRARY ***************
const Joi = require('joi');

/**
 * Joi validation schema for User input data.
 *
 * This schema defines the expected structure and constraints for user-related input,
 * ensuring each field conforms to type, length, and presence requirements.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 *
 * @property {string} firstName - Required. The user's first name (3–100 characters).
 * @property {string} lastName - Required. The user's last name (3–100 characters).
 * @property {string} email - Required. The user's email address (5–50 characters).
 * @property {string} role - Required. The user's role or access level (3–50 characters).
 * @property {string} password - Required. The user's password (5–50 characters).
 * @property {Date} [created_at] - Optional. Timestamp for when the user was created.
 * @property {Date} [updated_at] - Optional. Timestamp for when the user was last updated.
 */
const userSchema = Joi.object({
  // *************** first_name: required string, 3–100 characters
  first_name: Joi.string().min(3).max(100).required(),
  // *************** last_name: required string, 3–100 characters
  last_name: Joi.string().min(3).max(100).required(),
  // *************** email: required string, 5–50 characters
  email: Joi.string().min(5).max(50).required(),
  // role: required string, 3–50 characters
  role: Joi.string().min(3).max(50).required(),
  // password: required string, 3–50 characters
  password: Joi.string().min(5).max(50).required(),
  // created_at (timestamp): optional date
  created_at: Joi.date().optional(),
  // updated_at (timestamp): optional date
  updated_at: Joi.date().optional()
});

/**
 * Validates user input data against the defined Joi schema.
 *
 * This function checks whether the provided user input conforms to the expected structure,
 * types, and constraints defined in `userSchema`. It returns the validated data if successful,
 * or throws an error if the validation fails.
 *
 * @function
 * @param {Object} input - The raw user input data to be validated.
 * @param {string} input.firstName - User's first name (required, 3–100 characters).
 * @param {string} input.lastName - User's last name (required, 3–100 characters).
 * @param {string} input.email - User's email address (required, 5–50 characters).
 * @param {string} input.role - User's role or permission level (required, 3–50 characters).
 * @param {string} input.password - User's password (required, 5–50 characters).
 * @param {Date} [input.createdAt] - Optional timestamp for creation.
 * @param {Date} [input.updatedAt] - Optional timestamp for last update.
 * @returns {Object} - The validated and sanitized user data.
 * @throws {Error} - Throws an error if validation fails, including the Joi validation message.
 */
function validateUser(input) {
  // *************** Destructure the result of validation into error and value
  const { error, value } = userSchema.validate(input);
  // *************** If validation fails, throw an error with a descriptive message
  if (error) {
    throw new Error(`User validation failed: ${error.message}`);
  }
  // *************** If validation succeeds, return the validated and sanitized data
  return value;
}

// *************** EXPORT MODULE ***************
module.exports = validateUser;
