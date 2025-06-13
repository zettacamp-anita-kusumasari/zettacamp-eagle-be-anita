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
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    // Reference to the person who delete the student data
    deleteBy: {
        type: mongoose.Schema.Types.ObjectId,
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
module.exports = mongoose.model('Student', studentSchema);