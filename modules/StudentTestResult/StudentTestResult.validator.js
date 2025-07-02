// *************** IMPORT LIBRARY ***************
const { ApolloError } = require('apollo-server');
const Validator = require('validator');

// *************** Valid status for test_status
const ValidStatus = ['IN_PROGRESS', 'GRADED', 'DELETED'];

function ValidateStudentTestResultInput(input) {
    // *************** Destructure expected fields from the input object
    const {
        marks,
        average_mark,
        mark_entry_date,
        student_test_result_status
    } = input;
    // *************** Validate marks: must be an array and not empty
    if (!Array.isArray(marks) || marks.length === 0) {
        throw new ApolloError('Marks is required and must be a non-empty array.', 'BAD_USER_INPUT', { field: 'marks' });
    }
    // *************** Validate each mark item
    marks.forEach(function (mark, index) {
        // *************** Validate that notation_text is provided and not an empty string
        if (!mark.notation_text || Validator.isEmpty(mark.notation_text)) {
            throw new ApolloError(`Notation Text at index ${index} is required.`, 'BAD_USER_INPUT', { field: `marks[${index}].notation_text` });
        }
        // *************** Validate that mark is provided and float
        if (mark.mark === undefined || !Number.isFinite(Number(mark.mark))) {
            throw new ApolloError(`Mark at index ${index} must be a valid number.`, 'BAD_USER_INPUT', { field: `marks[${index}].mark` });
        }
    });
    // *************** Validate that weight is a valid float
    if (average_mark && !Number.isFinite(Number(average_mark))) {
        throw new ApolloError('Average Mark must be a valid float.', 'BAD_USER_INPUT', { field: 'average_mark' });
    }
    // *************** Validate that mark_entry_date is provided
    if (!mark_entry_date || isNaN(new Date(mark_entry_date).getTime())) {
        throw new ApolloError('Mark Entry Date is required and must be a valid date.', 'BAD_USER_INPUT', {field: 'mark_entry_date'});
    }
    // *************** Validate that student_test_result_status exists and is within the allowed values ('IN_PROGRESS' | 'GRADED' | 'DELETED')
    if (!student_test_result_status || !ValidStatus.includes(student_test_result_status.toUpperCase())) {
        throw new ApolloError(`Student Test Result Status must be one of: ${ValidStatus.join(', ')}.`, 'BAD_USER_INPUT', {field: 'student_test_result_status'});
    }
}

// *************** EXPORT MODULE ***************
module.exports = {
    ValidateStudentTestResultInput
};
