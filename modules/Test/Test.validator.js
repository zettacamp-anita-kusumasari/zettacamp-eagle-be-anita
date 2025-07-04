// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Validator = require('validator');

// *************** Valid status for test_status
const ValidStatus = ['PUBLISHED', 'NOT_PUBLISHED'];

function ValidateTestInput(input) {
    // *************** Destructure expected fields from the input object
    const {
        name,
        description,
        weight,
        notations,
        test_status,
        for_retake,
        published_date
    } = input;
    // *************** Validate that name is provided and not an empty string
    if (!name || Validator.isEmpty(name)) {
        throw new ApolloError('Name is required.', 'BAD_USER_INPUT', { field: 'name' });
    }
    // *************** Validate that description is provided and not an empty string
    if (!description || Validator.isEmpty(description)) {
        throw new ApolloError('Description is required.', 'BAD_USER_INPUT', { field: 'description' });
    }
    // *************** Validate that weight is a valid float
    if (weight && !Number.isFinite(Number(weight))) {
        throw new ApolloError('Weight must be a valid float.', 'BAD_USER_INPUT', { field: 'weight' });
    }
    // *************** Validate notations: must be an array and not empty
    if (!Array.isArray(notations) || notations.length === 0) {
        throw new ApolloError('Notations is required and must be a non-empty array.', 'BAD_USER_INPUT', { field: 'notations' });
    }
    // *************** Validate each notation item
    notations.forEach(function (notation, index) {
        // *************** Validate that notation_text is provided and not an empty string
        if (!notation.notation_text || Validator.isEmpty(notation.notation_text)) {
            throw new ApolloError(`Notation Text at index ${index} is required.`, 'BAD_USER_INPUT', { field: `notations[${index}].notation_text` });
        }
        // *************** Validate that max_point is provided and float
        if (notation.max_point === undefined || !Number.isFinite(Number(notation.max_point))) {
            throw new ApolloError(`Max Point at index ${index} must be a valid number.`, 'BAD_USER_INPUT', { field: `notations[${index}].max_point` });
        }
        // *************** Validate that max_point is not negative
        if (Number(notation.max_point) < 0) {
            throw new ApolloError(`Max Point at index ${index} cannot be negative.`, 'BAD_USER_INPUT', { field: `notations[${index}].max_point` });
        }
    });
    // *************** Validate that test status exists and is within the allowed values ('PUBLISHED', 'NOT_PUBLISHED')
    if (!test_status || !ValidStatus.includes(test_status.toUpperCase())) {
        throw new ApolloError(`Test status must be one of: ${ValidStatus.join(', ')}.`, 'BAD_USER_INPUT', {field: 'test_status'});
    }
    // *************** Validate that for_retake must be a boolean (true or false)
    if (typeof for_retake !== 'boolean') {
        throw new ApolloError('For Retake must be a boolean value.', 'BAD_USER_INPUT', {field: 'for_retake'});
    }
    // *************** Validate that published_date is provided
    if (!published_date || isNaN(new Date(published_date).getTime())) {
        throw new ApolloError('Published Date is required and must be a valid date.', 'BAD_USER_INPUT', {field: 'published_date'});
    }
}

// *************** EXPORT MODULE ***************
module.exports = {
    ValidateTestInput
};
