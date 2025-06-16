// *************** IMPORT LIBRARY ***************
const Mongoose = require('mongoose');

const studentSchema = new Mongoose.Schema({
    // Student's first name for identification
    first_name: {
        type: String,
        required: true
    },
    // Student's last name for identification
    last_name: {
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
    date_of_birth: {
        type: Date,
        required: true
    },
    // Reference to the School the student belongs to
    school_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'School' 
    },
    // Reference to the person who create the student data
    created_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    // Reference to the person who delete the student data
    delete_by: {
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
module.exports = Mongoose.model('Student', studentSchema);