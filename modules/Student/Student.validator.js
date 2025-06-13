// *************** IMPORT CORE ***************
const Joi = require('joi');
const mongoose = require('mongoose');

/**
 * Joi validation schema for a Student input object.
 *
 * This schema is used to validate the structure and constraints of student input data
 * before creating or updating a student record. It ensures required fields are present,
 * and that they conform to the expected format and length. Additionally, `schoolId` is
 * validated as a proper MongoDB ObjectId using a custom validator.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 *
 * @property {string} firstName - Required. First name of the student. Minimum 3, maximum 100 characters.
 * @property {string} lastName - Required. Last name of the student. Minimum 3, maximum 100 characters.
 * @property {string} email - Required. Email address of the student. Must be a valid email format and max 100 characters.
 * @property {Date} dateOfBirth - Required. Birth date of the student.
 * @property {string} [schoolId] - Optional. Must be a valid MongoDB ObjectId if provided.
 */
const studentInputSchema = Joi.object({
  firstName: Joi.string().min(3).max(100).required(),
  lastName: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().max(100).required(),
  dateOfBirth: Joi.date().required(),
  schoolId: Joi.string().custom(function (value, helpers) {
    // *************** Check if the string is a valid ObjectId using Mongoose's validation
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    // *************** If valid, return the original value to be used in the validated result
    return value;
  }, 'ObjectId validation').optional(),
});

/**
 * Validates student input data against the defined Joi schema.
 *
 * This function ensures that the provided student data matches the expected format and constraints
 * as defined in `studentInputSchema`. If the input is valid, it returns the validated and possibly
 * transformed data. If invalid, it throws an error describing the validation issue.
 *
 * @function
 * @param {Object} data - The raw student input data to validate.
 * @param {string} data.firstName - Student's first name (required, 3–100 characters).
 * @param {string} data.lastName - Student's last name (required, 3–100 characters).
 * @param {string} data.email - Student's email address (required, valid email format).
 * @param {Date|string} data.dateOfBirth - Student's birth date (required).
 * @param {string} [data.schoolId] - Optional MongoDB ObjectId string for the related school.
 * @returns {Object} - The validated and sanitized student data.
 * @throws {Error} - Throws an error if validation fails with details from Joi.
 */
function validateStudent(data) {
  // *************** Destructure the result of validation into error and value
  const { error, value } = studentInputSchema.validate(data);
  // *************** If validation fails, throw an error with the validation message
  if (error) {
    throw new Error(`Student validation error: ${error.message}`);
  }
  // *************** If validation succeeds, return the validated and possibly transformed value
  return value;
}

// *************** EXPORT MODULE ***************
module.exports = validateStudent;
