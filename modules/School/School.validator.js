// *************** IMPORT CORE ***************
const Joi = require('joi');

/**
 * Defines the validation schema for school input using Joi.
 *
 * This schema ensures that input data for creating or updating a school
 * meets the expected structure and constraints:
 * - `name` must be a non-empty string (3–100 characters).
 * - `address` is optional but must be 3–200 characters if provided.
 * - `city`, `country`, and `postal_code` are required strings with 3–50 characters.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @name schoolInputSchema
 */
const schoolInputSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(3).max(200).optional(),
  city: Joi.string().min(3).max(50).required(),
  country: Joi.string().min(3).max(50).required(),
  postal_code: Joi.string().min(3).max(50).required()
});

/**
 * Validates a school input object against the `schoolInputSchema`.
 *
 * This function checks whether the provided data adheres to the required structure
 * and value constraints defined for a school input. If the validation fails,
 * it throws an error with a descriptive message.
 *
 * @function validateSchool
 * @param {Object} data - The school input data to validate.
 * @param {string} data.name - The name of the school (3–100 characters).
 * @param {string} [data.address] - The optional address of the school (3–200 characters).
 * @param {string} data.city - The city where the school is located (3–50 characters).
 * @param {string} data.country - The country where the school is located (3–50 characters).
 * @param {string} data.postal_code - The postal or ZIP code (3–50 characters).
 * @throws {Error} If validation fails, an error is thrown with a message indicating the reason.
 * @returns {Object} The validated and possibly transformed school data.
 */
const validateSchool = (data) => {
  const { error, value } = schoolInputSchema.validate(data);
  if (error) {
    throw new Error(`Validation error: ${error.message}`);
  }
  return value;
};

// *************** EXPORT MODULE ***************
module.exports = validateSchool;