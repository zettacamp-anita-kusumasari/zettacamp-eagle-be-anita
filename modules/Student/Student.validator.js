// *************** IMPORT CORE ***************
const Joi = require('joi');

/**
 * Joi schema for validating student input data.
 *
 * This schema enforces the structure and constraints for a student object:
 * - `id`: required, must be a number or string.
 * - `firstName`: required, string between 3–100 characters.
 * - `lastName`: required, string between 3–100 characters.
 * - `email`: required, string between 5–50 characters.
 * - `dateOfBirth`: required, valid date object.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 */
const studentInputSchema = Joi.object({
  id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  firstName: Joi.string().min(3).max(100).required(),
  lastName: Joi.string().min(3).max(100).required(),
  email: Joi.string().min(5).max(50).required(),
  dateOfBirth: Joi.date().required(),
});

/**
 * Validates a student input object using the `studentInputSchema`.
 *
 * Ensures the provided data meets the structure and constraints defined for a student.
 * Throws an error if the validation fails.
 *
 * @function validateStudent
 * @param {Object} data - The student data to validate.
 * @param {string|number} data.id - Unique identifier for the student (string or number).
 * @param {string} data.firstName - Student's first name (3–100 characters).
 * @param {string} data.lastName - Student's last name (3–100 characters).
 * @param {string} data.email - Student's email address (5–50 characters).
 * @param {Date|string} data.dateOfBirth - Student's date of birth (valid date).
 * @throws {Error} Throws an error with a descriptive message if validation fails.
 * @returns {Object} The validated and possibly transformed student data.
 */
const validateStudent = (data) => {
  const { error, value } = studentInputSchema.validate(data);
  if (error) {
    throw new Error(`Student validation error: ${error.message}`);
  }
  return value;
};

// *************** EXPORT MODULE ***************
module.exports = validateStudent;