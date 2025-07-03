// // *************** IMPORT LIBRARY ***************
// const { ApolloError } = require('apollo-server');
// const Validator = require('validator');

// // *************** Valid status for test_type
// const ValidType = ['Assign_Corrector', 'Enter_Marks', 'Validate_Marks'];
// // *************** Valid status for test_status
// const ValidStatus = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

// function ValidateTaskInput(input) {
//     // *************** Destructure expected fields from the input object
//     const {
//         task_type,
//         task_status,
//         due_date
//     } = input;
//     // *************** Validate that task type exists and is within the allowed values ('Assign_Corrector', 'Enter_Marks', 'Validate_Marks')
//     if (!task_type || !ValidType.includes(task_type.toUpperCase())) {
//         throw new ApolloError(`Task type must be one of: ${ValidType.join(', ')}.`, 'BAD_USER_INPUT', {field: 'task_type'});
//     }
//     // *************** Validate that task status exists and is within the allowed values ('PENDING', 'IN_PROGRESS', 'COMPLETED')
//     if (!task_status || !ValidStatus.includes(task_status.toUpperCase())) {
//         throw new ApolloError(`Task status must be one of: ${ValidStatus.join(', ')}.`, 'BAD_USER_INPUT', {field: 'task_status'});
//     }
//     // *************** Validate that published_date is provided
//     if (!due_date || isNaN(new Date(due_date).getTime())) {
//         throw new ApolloError('Due Date is required and must be a valid date.', 'BAD_USER_INPUT', {field: 'due_date'});
//     }
// }

// // *************** EXPORT MODULE ***************
// module.exports = {
//     ValidateTaskInput
// };

function ValidateMarksInput(marks) {
    if (!Array.isArray(marks) || marks.length === 0) {
        throw new ApolloError('Marks must be a non-empty array', 'BAD_USER_INPUT');
    }

    for (const entry of marks) {
        if (
            !entry ||
            typeof entry !== 'object' ||
            typeof entry.notation_text !== 'string' ||
            entry.notation_text.trim() === '' ||
            typeof entry.mark !== 'number' ||
            isNaN(entry.mark) ||
            entry.mark < 0 ||
            entry.mark > 100
        ) {
            throw new ApolloError(
                `Invalid mark entry. Each mark must include a valid notation_text and a mark between 0 and 100.`,
                'BAD_USER_INPUT'
            );
        }
    }
}

// *************** EXPORT MODULE ***************
module.exports = {
    ValidateMarksInput
};