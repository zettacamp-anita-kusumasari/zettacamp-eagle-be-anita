// *************** IMPORT LIBRARY ***************
const Mongoose = require('mongoose')

// *************** Define Mongoose schema for the Subject collection
const SubjectSchema = new Mongoose.Schema({
    // Reference to the block this subject belongs to (one subject belongs to one block)
    block_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Block'
    },
    // Name of the subject for identification
    name: {
        type: String,
        required: true
    },
    // Description of the subject for overview
    description: {
        type: String,
        required: true
    },
    // The coefficient used for average score calculation
    coefficient: {
        type: Number,
        required: true,
        min: [0, 'Coefficient must be a positive number']
    },
    // A list of IDs referencing the Test documents related to this Subject
    test_ids: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Test'
    }],
    // A short, unique code for internal or display use
    subject_code: {
        type: String,
        required: true
    },
    // Status of the subject, is it ‘ACTIVE’ or ‘COMPLETED’
    subject_status: {
        type: String,
        enum: ['ACTIVE', 'COMPLETED'],
        required: true
    },
    // Reference to the person who create the subject data
    created_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Reference to the person who update the subject data
    updated_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Reference to the person who delete the subject data
    deleted_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},{
    // Automatically adds created_at, updateAt, and deleted_at fields
    timestamps: {
        created_at: 'Created_At',
        updated_at: 'Updated_At',
        deleted_at: 'Deleted_At'
    }
});

// *************** EXPORT MODULE ***************
module.exports = Mongoose.model('Subject', SubjectSchema);