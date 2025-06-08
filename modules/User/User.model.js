// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // User's first name for identification
    firstName: {
        type: String,
        required: true,
    },
    // User's last name for identification
    lastName: {
        type: String,
        required: true,
    },
    // User's email for identification
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Password for authentication
    password: {
        type: String,
        required: true,
    },
    // Role of the user
    role: {
        type: String,
        required: true,
    },
    // Soft delete field
    deletedAt: {
        type: Date,
        default: null,
    },
},{
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
});

// *************** EXPORT MODULE ***************
module.exports = mongoose.model('User', userSchema);