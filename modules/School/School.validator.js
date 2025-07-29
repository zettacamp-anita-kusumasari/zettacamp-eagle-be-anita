// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Validator = require('validator');

// *************** Valid status for school_status
const ValidStatus = ['ACTIVE', 'INACTIVE'];

/**
 * Validates the input data for creating or updating a school.
 *
 * This function checks for the presence and correctness of required fields such as
 * `legal_name`, `commercial_name`, `logo`, `address`, and `school_status`. It ensures that
 * strings are not empty, URLs are valid (for `logo`), and that `address` is a valid object
 * containing properly formatted subfields. It also checks if `school_status` is one of the allowed values
 * defined in `ValidStatus`.
 *
 * If any field is invalid or missing, the function throws an `ApolloError` with a `BAD_USER_INPUT` code
 * and includes the name of the invalid field in the error extensions.
 *
 * @function ValidateSchoolInput
 * @param {Object} input - The school input data to validate.
 * @param {string} input.legal_name - The legal name of the school (required, non-empty).
 * @param {string} input.commercial_name - The commercial name of the school (required, non-empty).
 * @param {string} [input.logo] - Optional URL to the school's logo (must be a valid URL if provided).
 * @param {Object} input.address - The address object containing street, city, country, and ZIP code.
 * @param {string} input.address.street_name - Street name (required, non-empty).
 * @param {string} input.address.city - City name (required, non-empty).
 * @param {string} input.address.country - Country name (required, non-empty).
 * @param {string} input.address.zip_code - ZIP code (required, non-empty).
 * @param {string} input.school_status - Status of the school (must match one of `ValidStatus` values).
 * @throws {ApolloError} If any required field is missing or invalid.
 */
function ValidateSchoolInput(input) {
  // *************** Destructure expected fields from the input object
  const {
    legal_name,
    commercial_name,
    logo,
    address,
    school_status,
  } = input;
  // *************** Validate that legal_name is provided and not an empty string
  if (!legal_name || Validator.isEmpty(legal_name)) {
    throw new ApolloError('Legal name is required.', 'BAD_USER_INPUT', { field: 'legal_name' });
  }
  // *************** Validate that commercial_name is provided and not an empty string
  if (!commercial_name || Validator.isEmpty(commercial_name)) {
    throw new ApolloError('Commercial name is required.', 'BAD_USER_INPUT', { field: 'commercial_name' });
  }
  // *************** If logo is provided, validate that it's a valid URL
  if (logo && !Validator.isURL(logo)) {
    throw new ApolloError('Logo must be a valid URL.', 'BAD_USER_INPUT', { field: 'logo' });
  }
  // *************** Validate that address is provided and is an object
  if (!address || typeof address !== 'object') {
    throw new ApolloError('Address is required and must be an object.', 'BAD_USER_INPUT', { field: 'address' });
  }
  // *************** Destructure subfields from the address object
  const {
    street_name,
    city,
    country,
    zip_code
  } = address;
  // *************** Validate that street_name is provided and not an empty string
  if (!street_name || Validator.isEmpty(street_name)) {
    throw new ApolloError('Street name is required.', 'BAD_USER_INPUT', { field: 'address.street_name' });
  }
  // *************** Validate that city is provided and not an empty string
  if (!city || Validator.isEmpty(city)) {
    throw new ApolloError('City is required.', 'BAD_USER_INPUT', { field: 'address.city' });
  }
  // *************** Validate that country is provided and not an empty string
  if (!country || Validator.isEmpty(country)) {
    throw new ApolloError('Country is required.', 'BAD_USER_INPUT', { field: 'address.country' });
  }
  // *************** Validate that zip_code is provided and not an empty string
  if (!zip_code || Validator.isEmpty(zip_code)) {
    throw new ApolloError('Zip code is required.', 'BAD_USER_INPUT', { field: 'address.zip_code' });
  }
  // *************** Validate that school_status exists and is within the allowed values
  if (!school_status || !ValidStatus.includes(school_status.toUpperCase())) {
    throw new ApolloError(`School status must be one of: ${ValidStatus.join(', ')}.`, 'BAD_USER_INPUT', {field: 'school_status'});
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
    ValidateSchoolInput
};
