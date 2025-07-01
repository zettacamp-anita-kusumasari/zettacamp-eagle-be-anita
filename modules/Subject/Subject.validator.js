// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Validator = require('validator');

// *************** Valid status for subject_status
const ValidStatus = ['ACTIVE', 'COMPLETED'];

function ValidateSubjectInput(input) {
    // *************** Destructure expected fields from the input object
    const {
        name,
        description,
        coefficient,
        subject_code,
        subject_status
    } = input;
    // *************** Validate that name is provided and not an empty string
    if (!name || Validator.isEmpty(name)) {
        throw new ApolloError('Name is required.', 'BAD_USER_INPUT', { field: 'name' });
    }
    // *************** Validate that description is provided and not an empty string
    if (!description || Validator.isEmpty(description)) {
        throw new ApolloError('Description is required.', 'BAD_USER_INPUT', { field: 'description' });
    }
    // *************** Validate that coefficient is a valid float
    if (coefficient && !Number.isFinite(Number(coefficient))) {
        throw new ApolloError('Coefficient must be a valid float.', 'BAD_USER_INPUT', { field: 'coefficient' });
    }
    // *************** Validate that subject code is provided and not an empty string
    if (!subject_code || Validator.isEmpty(subject_code)) {
        throw new ApolloError('Subject code is required.', 'BAD_USER_INPUT', { field: 'subject_code' });
    }
    // *************** Validate that subject status exists and is within the allowed values (‘ACTIVE’ | ‘COMPLETED’)
    if (!subject_status || !ValidStatus.includes(subject_status.toUpperCase())) {
        throw new ApolloError(`Subject status must be one of: ${ValidStatus.join(', ')}.`, 'BAD_USER_INPUT', {field: 'subject_status'});
    }
}

// *************** EXPORT MODULE ***************
module.exports = {
    ValidateSubjectInput
};
