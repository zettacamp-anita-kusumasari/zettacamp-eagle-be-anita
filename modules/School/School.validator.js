// *************** IMPORT LIBRARY ***************
const Joi = require('joi');
const { ApolloError } = require('apollo-server-express');

/**
 * Joi validation schema for a School object.
 *
 * This schema is used to validate the structure and data types of a school object
 * before it is created or updated in the database.
 * It enforces constraints such as required fields, string lengths, object ID formats,
 * and optional date fields. It also supports flexible formats for related object references
 * (e.g., `students`, `created_by`, `deleted_by`) allowing either an ObjectId string or full object.
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
 * @property {string|Object} [created_by] - Optional. User ID (24-char hex string) or user object.
 * @property {string|Object} [deleted_by] - Optional. User ID (24-char hex string) or user object.
 * @property {Date} [created_at] - Optional. Date when the school was created.
 * @property {Date} [updated_at] - Optional. Date when the school was last updated.
 * @property {Date} [deleted_at] - Optional. Date when the school was deleted.
 */
const schoolSchema = Joi.object({
  // *************** School name: required string, 2–100 characters
  name: Joi.string().min(2).max(100).required(),
  // *************** School initial_name: required string, 1–20 characters
  initial_name: Joi.string().min(1).max(20).required(),
  // *************** address: required string, 5–200 characters
  address: Joi.string().min(5).max(200).required(),
  // *************** city: required string, 2–100 characters
  city: Joi.string().min(2).max(100).required(),
  // *************** country: required string, 2–100 characters
  country: Joi.string().min(2).max(100).required(),
  // *************** postal_code: required string, 3–15 characters
  postal_code: Joi.string().min(3).max(15).required(),
  // *************** Students field: optional, can be a MongoDB ObjectId string or an object
  students: Joi.alternatives().try(Joi.string().hex().length(24), Joi.object()).optional(),
  // *************** created_by: optional, can be a MongoDB ObjectId string or an object
  created_by: Joi.alternatives().try(Joi.string().hex().length(24), Joi.object()).optional(),
  // *************** deleted_by: optional, can be a MongoDB ObjectId string or an object
  deleted_by: Joi.alternatives().try(Joi.string().hex().length(24), Joi.object()).optional(),
  // *************** created_at: optional date
  created_at: Joi.date().optional(),
  // *************** updated_at: optional date
  updated_at: Joi.date().optional(),
  // *************** deleted_at: optional date
  deleted_at: Joi.date().optional()
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
function ValidateSchool(input) {
  // *************** Perform validation using the predefined schoolSchema
  const { error, value } = schoolSchema.validate(input);
  // *************** If validation fails, throw an error with the validation message
  if (error) {
    // throw new Error(`School validation failed: ${error.message}`);
    throw new ApolloError(`School validation failed: ${error.message}`, "INTERNAL_SERVER_ERROR");
  }
  // *************** If validation succeeds, return the validated and possibly transformed value
  return value;
}

// *************** EXPORT MODULE ***************
module.exports = ValidateSchool;
