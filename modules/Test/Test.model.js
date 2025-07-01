// *************** IMPORT LIBRARY ***************
const Mongoose = require('mongoose')

// *************** Define Mongoose schema for the Test collection
const TestSchema = new Mongoose.Schema({
    // reference to the Subject this test belongs to
    subject_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    // Name of the test for identification
    name: {
        type: String,
        required: true
    },
    // Description of the test for overview
    description: {
        type: String,
        required: true
    },
    // The weight of the average score
    weight: {
        type: Number,
        required: true,
        min: [0, 'Weight cannot be negative']
    },
    // Test's notations 
    notations: [{
        // Description or label of the part of the test
        notation_text: {
            type: String,
            required: true
        },
        // Maximum points that can be scored in this part. Note: cannot be negative
        max_point: {
            type: Number,
            required: true,
            min: [0, 'max_point cannot be negative']
        }
    }],
    // Status of the test, is it ‘TO_DO’ or ‘FINISHED’
    test_status: {
        type: String,
        enum: ['TO_DO', 'FINISHED'],
        required: true
    },
    // Check the test, is it for retake or not
    for_retake: {
        type: Boolean,
        required: true
    },
    // Corrector of the test, is it ‘CERTIFIER’ or ‘PREPARATION CENTER’
    corrector: {
        type: String,
        enum: ['CERTIFIER', 'PREPARATION_CENTER'],
        required: true
    },
    // Reference to the person who published the test
    published_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
        deleted_at: 'Deleted_At',
        published_date: 'Published_Date'
    }
});

// *************** EXPORT MODULE ***************
module.exports = Mongoose.model('Test', TestSchema);