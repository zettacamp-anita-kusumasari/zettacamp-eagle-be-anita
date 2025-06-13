// *************** IMPORT LIBRARY ***************
const Joi = require('joi');

/**
 * Joi validation schema for a School object.
 *
 * This schema is used to validate the structure and data types of a school object
 * before it is created or updated in the database.
 * It enforces constraints such as required fields, string lengths, object ID formats,
 * and optional date fields. It also supports flexible formats for related object references
 * (e.g., `students`, `createdBy`, `deletedBy`) allowing either an ObjectId string or full object.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 *
 * @property {string} name - Required. School's full name. Min 2, max 100 characters.
 * @property {string} initial_name - Required. Shortened or initial name. Min 1, max 20 characters.
 * @property {string} address - Required. Full address. Min 5, max 200 characters.
 * @property {string} city - Required. City name. Min 2, max 100 characters.
 * @property {string} country - Required. Country name. Min 2, max 100 characters.
 * @property {string} postal_code - Required. Postal code. Min 3, max 15 characters.
 * @property {string|Object} [students] - Optional. A single student ID (24-char hex string) or object.
 * @property {string|Object} [createdBy] - Optional. User ID (24-char hex string) or user object.
 * @property {string|Object} [deletedBy] - Optional. User ID (24-char hex string) or user object.
 * @property {Date} [createdAt] - Optional. Date when the school was created.
 * @property {Date} [updatedAt] - Optional. Date when the school was last updated.
 * @property {Date} [deletedAt] - Optional. Date when the school was deleted.
 */
const schoolSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  initial_name: Joi.string().min(1).max(20).required(),
  address: Joi.string().min(5).max(200).required(),
  city: Joi.string().min(2).max(100).required(),
  country: Joi.string().min(2).max(100).required(),
  postal_code: Joi.string().min(3).max(15).required(),
  students: Joi.alternatives().try(Joi.string().hex().length(24), Joi.object()).optional(),
  createdBy: Joi.alternatives().try(Joi.string().hex().length(24), Joi.object()).optional(),
  deletedBy: Joi.alternatives().try(Joi.string().hex().length(24), Joi.object()).optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  deletedAt: Joi.date().optional()
});

/**
 * Validates input data against the school schema.
 *
 * This function uses the predefined `schoolSchema` (a Joi schema) to validate
 * the structure and values of a school object. If the input is valid,
 * the sanitized and validated value is returned. Otherwise, it throws an error
 * describing the validation failure.
 *
 * @function
 * @param {Object} input - The input object representing a school to be validated.
 * @returns {Object} - The validated and possibly transformed school object.
 * @throws {Error} - Throws an error if validation fails with details from Joi.
 */
function validateSchool(input) {
  // *************** Perform validation using the predefined schoolSchema
  const { error, value } = schoolSchema.validate(input);
  // *************** If validation fails, throw an error with the validation message
  if (error) {
    throw new Error(`School validation failed: ${error.message}`);
  }
  // *************** If validation succeeds, return the validated and possibly transformed value
  return value;
}

// *************** EXPORT MODULE ***************
module.exports = validateSchool;
