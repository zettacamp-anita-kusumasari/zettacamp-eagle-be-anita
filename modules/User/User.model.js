// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    // User's email for identification
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Role of the user
    role: {
        type: String,
        required: true,
    },
    // Password for authentication
    password: {
        type: String,
        required: true,
    },
},{
    // Automatically adds created_at and updated_at fields
    timestamps: {
        created_at: 'created_at',
        updated_at: 'updated_at'
    }
});

// *************** EXPORT MODULE ***************
module.exports = mongoose.model('User', userSchema);