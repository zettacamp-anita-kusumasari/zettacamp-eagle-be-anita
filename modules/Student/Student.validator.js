// *************** IMPORT CORE ***************
const Joi = require('joi');
const Mongoose = require('mongoose');
const { ApolloError } = require('apollo-server-express');

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
 * @property {string} first_name - Required. First name of the student. Minimum 3, maximum 100 characters.
 * @property {string} last_name - Required. Last name of the student. Minimum 3, maximum 100 characters.
 * @property {string} email - Required. Email address of the student. Must be a valid email format and max 100 characters.
 * @property {Date} date_of_birth - Required. Birth date of the student.
 * @property {string} [school_id] - Optional. Must be a valid MongoDB ObjectId if provided.
 */
const studentInputSchema = Joi.object({
  // *************** first_name: required string, 3–100 characters
  first_name: Joi.string().min(3).max(100).required(),
  // *************** last_name: required string, 3–100 characters
  last_name: Joi.string().min(3).max(100).required(),
  // *************** email: required, must be a valid email format and max 100 characters
  email: Joi.string().email().max(100).required(),
  // *************** date_of_birth: required, must be a valid date
  date_of_birth: Joi.date().required(),
  // *************** school_id: optional, must be a valid MongoDB ObjectId if provided
  school_id: Joi.string().custom(function (value, helpers) {
    // *************** Check if the string is a valid ObjectId using Mongoose's validation
    if (!Mongoose.Types.ObjectId.isValid(value)) {
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
 * @param {string} data.first_name - Student's first name (required, 3–100 characters).
 * @param {string} data.last_name - Student's last name (required, 3–100 characters).
 * @param {string} data.email - Student's email address (required, valid email format).
 * @param {Date|string} data.date_of_birth - Student's birth date (required).
 * @param {string} [data.school_id] - Optional MongoDB ObjectId string for the related school.
 * @returns {Object} - The validated and sanitized student data.
 * @throws {Error} - Throws an error if validation fails with details from Joi.
 */
function ValidateStudent(data) {
  // *************** Destructure the result of validation into error and value
  const { error, value } = studentInputSchema.validate(data);
  // *************** If validation fails, throw an error with the validation message
  if (error) {
    // throw new Error(`Student validation error: ${error.message}`);
    throw new ApolloError(`Student validation failed: ${error.message}`, "INTERNAL_SERVER_ERROR");
  }
  // *************** If validation succeeds, return the validated and possibly transformed value
  return value;
}

// *************** EXPORT MODULE ***************
module.exports = ValidateStudent;
