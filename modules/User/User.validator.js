// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Validator = require('validator');

// *************** Valid status for school_status
const ValidStatus = ['ACTIVE', 'INACTIVE'];

/**
 * Validates the user input data before creating or updating a user.
 *
 * This function checks for required fields such as first name, last name, contact details,
 * role, user status, and password. It also validates field formats (e.g., email, URL).
 *
 * @param {Object} input - The input object containing user details.
 * @param {string} input.first_name - User's first name.
 * @param {string} input.last_name - User's last name.
 * @param {string} [input.photo_profile] - Optional URL to the user's profile photo.
 * @param {Object} input.contact - Object containing contact information.
 * @param {string} input.contact.phone_number - User's phone number.
 * @param {string} input.contact.email - User's email address.
 * @param {string} input.role - Role of the user.
 * @param {string} input.user_status - Status of the user (e.g., ACTIVE, INACTIVE).
 * @param {string} input.password - User's password (minimum 6 characters).
 * @throws {ApolloError} If any required field is missing or invalid.
 */
function ValidateUserInput(input) {
  const {
    first_name,
    last_name,
    photo_profile,
    contact,
    role,
    user_status,
    password
  } = input;
  // *************** Validate first name: required and not empty
  if (!first_name || Validator.isEmpty(first_name)) {
    throw new ApolloError('First name is required.', 'BAD_USER_INPUT', { field: 'first_name' });
  }
  // *************** Validate last name: required and not empty
  if (!last_name || Validator.isEmpty(last_name)) {
    throw new ApolloError('Last name is required.', 'BAD_USER_INPUT', { field: 'last_name' });
  }
  // *************** If photo_profile is provided, it must be a valid URL
  if (photo_profile && !Validator.isURL(photo_profile)) {
    throw new ApolloError('Photo profile must be a valid URL.', 'BAD_USER_INPUT', { field: 'photo_profile' });
  }
  // *************** Validate contact: must be an object
  if (!contact || typeof contact !== 'object') {
    throw new ApolloError('Contact is required.', 'BAD_USER_INPUT', { field: 'contact' });
  }
  // *************** Validate phone number inside contact: required and not empty
  if (!contact.phone_number || Validator.isEmpty(contact.phone_number)) {
    throw new ApolloError('Phone number is required.', 'BAD_USER_INPUT', { field: 'contact.phone_number' });
  }
  // *************** Validate email inside contact: required and must be a valid email
  if (!contact.email || !Validator.isEmail(contact.email)) {
    throw new ApolloError('Valid email is required.', 'BAD_USER_INPUT', { field: 'contact.email' });
  }
  // *************** Validate role: required and not empty
  if (!role || Validator.isEmpty(role)) {
    throw new ApolloError('Role number is required.', 'BAD_USER_INPUT', { field: 'role' });
  }
  // *************** Validate user status: must be one of the allowed values
  if (!user_status || !ValidStatus.includes(user_status.toUpperCase())) {
    throw new ApolloError(`User status must be one of: ${ValidStatus.join(', ')}.`, 'BAD_USER_INPUT',{ field: 'user_status' });
  }
  // *************** Validate password: required, not empty, and minimum 6 characters
  if (!password || Validator.isEmpty(password) || password.length < 6) {
    throw new ApolloError('Password is required and must be at least 6 characters.','BAD_USER_INPUT',{ field: 'password' });
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  ValidateUserInput
};
