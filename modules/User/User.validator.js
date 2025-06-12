// *************** IMPORT CORE ***************
const Joi = require('joi');

/**
 * Joi schema for validating user input data.
 *
 * This schema enforces the required structure and constraints for a user object:
 * - `id`: required, must be a string or number.
 * - `firstName`: required, string between 3–100 characters.
 * - `lastName`: required, string between 3–100 characters.
 * - `email`: required, string between 5–50 characters.
 * - `role`: required, string between 3–50 characters.
 * - `password`: required, string between 5–50 characters.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 */
const userInputSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  firstName: Joi.string().min(3).max(100).required(),
  lastName: Joi.string().min(3).max(100).required(),
  email: Joi.string().min(5).max(50).required(),
  role: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(5).max(50).required()
});

/**
 * Validates a user input object using the `userInputSchema`.
 *
 * Ensures the provided data adheres to the expected structure and constraints
 * for a user. If the validation fails, an error is thrown.
 *
 * @function validateUser
 * @param {Object} data - The user data to validate.
 * @param {string|number} data.id - Unique identifier for the user (string or number).
 * @param {string} data.firstName - User's first name (3–100 characters).
 * @param {string} data.lastName - User's last name (3–100 characters).
 * @param {string} data.email - User's email address (5–50 characters).
 * @param {string} data.role - Role assigned to the user (3–50 characters).
 * @param {string} data.password - User's password (5–50 characters).
 * @throws {Error} Throws an error with a descriptive message if validation fails.
 * @returns {Object} The validated and possibly transformed user data.
 */
const validateUser = (data) => {
  const { error, value } = userInputSchema.validate(data);
  if (error) {
    throw new Error(`User validation error: ${error.message}`);
  }
  return value;
};

// *************** EXPORT MODULE ***************
module.exports = validateUser;