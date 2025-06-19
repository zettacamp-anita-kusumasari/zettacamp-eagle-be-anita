// *************** IMPORT LIBRARY ***************
const { required } = require('joi');
const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
    // User's first name for identification
    first_name: {
        type: String,
        required: true,
    },
    // User's last name for identification
    last_name: {
        type: String,
        required: true,
    },
    // User's photo profile for identification
    photo_profile: {
        type: String,
        default: null,
    },
    // User's contact details 
    contact: {
        phone_number: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
    },
    // Role of the User
    role: {
        type: String,
        required: true,
    },
    // Reference for User's status
    user_status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        required: true
    },
    // Password for authentication
    password: {
        type: String,
        required: true,
    },
    // Reference to the person who create the user data
    created_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Reference to the person who update the user data
    updated_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Reference to the person who delete the user data
    deleted_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},{
    // Automatically adds created_at and updated_at fields
    timestamps: {
        created_at: 'Created_At',
        updated_at: 'Updated_At',
        deleted_at: 'Deleted_At'
    }
});

// *************** EXPORT MODULE ***************
module.exports = Mongoose.model('User', userSchema);