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
    // School's photo profile for identification
    photo_profile: {
        type: String,
        default: null
    },
    // Student's birth details
    student_birth: {
        date_of_birth: {
            type: Date,
            required: true
        },
        place_of_birth: {
            type: String,
            required: true
        }
    },
    // Status of the student: ENROLLED, GRADUATED, DROPPED_OUT, TRANSFERRED
    student_status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        required: true
    },
    // Student's contact details
    contact: {
        phone_number: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        }
    },
    // Student's address details
    address: {
        street_name: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        country: {
            type: String,
            default: null
        },
        zip_code: {
            type: String,
            default: null
        },
    },
    // Reference to the School the student belongs to
    school_id: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'School' 
    },
    // Reference to the person who creates the student data
    created_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    // Reference to the person who updates the student data
    updated_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    // Reference to the person who deletes the student data
    deleted_by: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
},{
    // Automatically adds created_at and update_at fields
    timestamps: {
        created_at: 'Created_At',
        updated_at: 'Updated_At',
        deleted_at: 'Deleted_At'
    }
});

// *************** EXPORT MODULE ***************
module.exports = Mongoose.model('Student', studentSchema);