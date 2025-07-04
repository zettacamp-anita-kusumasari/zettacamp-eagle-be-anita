// *************** IMPORT LIBRARY ***************
const Mongoose = require('mongoose')

// *************** Define Mongoose schema for the School collection
const schoolSchema = new Mongoose.Schema({
    // School's name for identification
    legal_name: {
        type: String,
        required: true
    },
    // School's initial name for identification
    commercial_name: {
        type: String,
        required: true
    },
    // School's logo for identification
    logo: {
        type: String,
        default: null
    },
    // School's address for identification
    address: {
        street_name: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zip_code: {
            type: String,
            required: true
        },
    },
    // Status of the school: ACTIVE and INACTIVE
    school_status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        required: true
    },
    // Reference to the Students (one-to-many relationship)
    students: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    // Reference to the person who create the school data
    created_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Reference to the person who update the school data
    updated_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Reference to the person who delete the school data
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
module.exports = Mongoose.model('School', schoolSchema);