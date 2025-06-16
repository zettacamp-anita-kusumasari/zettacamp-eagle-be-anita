// *************** IMPORT LIBRARY ***************
const Mongoose = require('mongoose')

const schoolSchema = new Mongoose.Schema({
    // School's name for identification
    name: {
        type: String,
        required: true
    },
    // School's initial name for identification
    initial_name: {
        type: String,
        required: true
    },
    // School's address for identification
    address: {
        type: String,
        required: true
    },
    // School's city for identification
    city: {
        type: String,
        required: true
    },
    // School's country for identification
    country: {
        type: String,
        required: true
    },
    // School's postal code for identification
    postal_code: {
        type: String,
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
    // Reference to the person who delete the school data
    deleted_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},{
    // Automatically adds created_at and updateAt fields
    timestamps: {
        created_at: 'created_at',
        updated_at: 'updated_at'
    }
});

// *************** EXPORT MODULE ***************
module.exports = Mongoose.model('School', schoolSchema);