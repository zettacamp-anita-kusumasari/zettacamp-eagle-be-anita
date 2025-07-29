// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Validator = require('validator');
const Mongoose = require("mongoose");

// *************** Valid status for school_status
const ValidStatus = ['ACTIVE', 'INACTIVE'];

/**
 * Validates the input object for creating or updating a student.
 *
 * This function performs validation on multiple fields of the `input` object,
 * including first name, last name, photo profile URL, birth information,
 * student status, contact details, and address. It throws an `ApolloError`
 * with specific error codes and field names if validation fails.
 *
 * @function ValidateStudentInput
 * @param {Object} input - The student input object to validate.
 * @param {string} input.first_name - Student's first name (required, non-empty).
 * @param {string} input.last_name - Student's last name (required, non-empty).
 * @param {string} [input.photo_profile] - Optional URL for the student's profile photo (must be valid URL if provided).
 * @param {Object} input.student_birth - Object containing student birth information.
 * @param {string} input.student_birth.date_of_birth - Required date of birth (must be a valid date string).
 * @param {string} input.student_birth.place_of_birth - Required place of birth (non-empty).
 * @param {string} input.student_status - Student status (must be one of the allowed `ValidStatus` values).
 * @param {Object} input.contact - Object containing contact information.
 * @param {string} input.contact.phone_number - Required phone number (non-empty).
 * @param {Object} [input.address] - Optional address object containing location details.
 * @param {string} [input.address.street_name] - Street name (if provided, must not be empty).
 * @param {string} [input.address.city] - City (if provided, must not be empty).
 * @param {string} [input.address.country] - Country (if provided, must not be empty).
 * @param {string} [input.address.zip_code] - Zip code (if provided, must not be empty).
 * @param {string} [input.school_id] - Optional ID of the related school (validation not performed here).
 *
 * @throws {ApolloError} If any required field is missing, invalid, or empty.
 */
function ValidateStudentInput(input) {
  // *************** Destructure input object into expected fields
  const {
    first_name,
    last_name,
    e_mail,
    student_birth,
    student_status,
    address,
    school_id
  } = input;

  // *************** Validate first_name: must be present and not empty
  if (!first_name || Validator.isEmpty(first_name)) {
    throw new ApolloError('First name is required.', 'BAD_USER_INPUT', { field: 'first_name' });
  }
  // *************** Validate last_name: must be present and not empty
  if (!last_name || Validator.isEmpty(last_name)) {
    throw new ApolloError('Last name is required.', 'BAD_USER_INPUT', { field: 'last_name' });
  }
  // *************** Validate photo_profile: if present, must be a valid URL
  if (!e_mail || Validator.isEmpty(e_mail)) {
    throw new ApolloError('e_mail is required.', 'BAD_USER_INPUT', { field: 'e_mail' });
  }
  // *************** Validate student_birth: must be an object
  if (!student_birth || typeof student_birth !== 'object') {
    throw new ApolloError('Student birth data is required.', 'BAD_USER_INPUT', { field: 'student_birth' });
  }
  // *************** Validate student_birth.date_of_birth: must be a valid date string
  if (!student_birth.date_of_birth || isNaN(Date.parse(student_birth.date_of_birth))) {
    throw new ApolloError('Valid date of birth is required.', 'BAD_USER_INPUT', { field: 'student_birth.date_of_birth' });
  }
  // *************** Validate student_birth.place_of_birth: must be present and not empty
  if (!student_birth.place_of_birth || Validator.isEmpty(student_birth.place_of_birth)) {
    throw new ApolloError('Place of birth is required.', 'BAD_USER_INPUT', { field: 'student_birth.place_of_birth' });
  }
  // *************** Validate student_status: must be one of the allowed values
  if (!student_status || !ValidStatus.includes(student_status.toUpperCase())) {
    throw new ApolloError(`Student status must be one of: ${ValidStatus.join(', ')}`, 'BAD_USER_INPUT', { field: 'student_status' });
  }
  // *************** Validate address: must be an object with complete fields
  if (!address || typeof address !== 'object') {
    throw new ApolloError('Address is required and must be an object.', 'BAD_USER_INPUT', { field: 'address' });
  }
  // *************** Validate address.street_name: must be present and not empty
  if (!address.street_name || Validator.isEmpty(address.street_name)) {
    throw new ApolloError('Street name is required.', 'BAD_USER_INPUT', { field: 'address.street_name' });
  }
  // *************** Validate address.city: must be present and not empty
  if (!address.city || Validator.isEmpty(address.city)) {
    throw new ApolloError('City is required.', 'BAD_USER_INPUT', { field: 'address.city' });
  }
  // *************** Validate address.country: must be present and not empty
  if (!address.country || Validator.isEmpty(address.country)) {
    throw new ApolloError('Country is required.', 'BAD_USER_INPUT', { field: 'address.country' });
  }
  // *************** Validate address.zip_code: must be present and not empty
  if (!address.zip_code || Validator.isEmpty(address.zip_code)) {
    throw new ApolloError('Zip code is required.', 'BAD_USER_INPUT', { field: 'address.zip_code' });
  }
  // *************** Validate that block_id is a Valid ObjectId Mongoose
  if (!Mongoose.Types.ObjectId.isValid(school_id)) {
    throw new ApolloError(`Invalid ID: ${school_id}`, "BAD_USER_INPUT");
  }
}

// *************** EXPORT MODULE ***************
module.exports = {
  ValidateStudentInput
};
