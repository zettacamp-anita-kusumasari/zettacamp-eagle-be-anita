// *************** IMPORT LIBRARY ***************
const Mongoose = require('mongoose')

// *************** Define Mongoose schema for the Test collection
const StudentTestResultSchema = new Mongoose.Schema({
    // reference to the Student who took the test
    student_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    // reference to the Test the result belongs to
    test_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Test'
    },
    // Student Test Result's marks 
    marks: [{
        // Description of the notation, e.g., "Clarity of explanation”
        notation_text: {
            type: String,
            required: true
        },
        // the mark received by the student for this notation
        mark: {
            type: Number,
            required: true
        }
    }],
    // The calculated average mark
    average_mark: {
        type: Number,
        required: true
    },
    // The date the marks were entered
    mark_entry_date: {
        type: Date,
        required: true
    },
    // Status of the student test result, is it ‘IN_PROGRESS’, ‘GRADED’, and ‘DELETED’
    student_test_result_status_status: {
        type: String,
        enum: ['IN_PROGRESS', 'GRADED', 'DELETED'],
        required: true
    },
    // Reference to the person who create the test data
    created_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Reference to the person who update the test data
    updated_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Reference to the person who delete the test data
    deleted_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},{
    // Automatically adds created_at, updateAt, deleted_at, and published_date fields
    timestamps: {
        created_at: 'Created_At',
        updated_at: 'Updated_At',
        deleted_at: 'Deleted_At'
    }
});

// *************** EXPORT MODULE ***************
module.exports = Mongoose.model('StudentTestResult', StudentTestResultSchema);