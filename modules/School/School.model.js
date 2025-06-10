// *************** IMPORT CORE ***************
const mongoose = require('mongoose')

const schoolSchema = new mongoose.Schema({
    // School's name for identification
    name: {
        type: String,
        required: true,
    },
    // School's address for identification
    address: {
        type: String,
        default: '',
    },
    // Reference to the Students (one-to-many relationship)
    students: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        default: null,
    },
    // Soft delete field
    deletedAt: {
        type: Date,
        default: null,
    },
},{
    // Automatically adds createdAt and updateAt fields
    timestamps: true,
});

// *************** EXPORT MODULE ***************
module.exports = mongoose.model('School', schoolSchema);