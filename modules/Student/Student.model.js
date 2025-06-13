// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    // Student's first name for identification
    firstName: {
        type: String,
        required: true
    },
    // Student's last name for identification
    lastName: {
        type: String,
        required: true
    },
    // Student's email for identification
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Student's date of birth for additional data
    dateOfBirth: {
        type: Date,
        required: true
    },
    // Reference to the School the student belongs to
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School' 
    },
    // Reference to the person who create the student data
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    // Reference to the person who delete the student data
    deleteBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
},{
    // Automatically adds createdAt and updateAt fields
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

// *************** EXPORT MODULE ***************
module.exports = mongoose.model('Student', studentSchema);