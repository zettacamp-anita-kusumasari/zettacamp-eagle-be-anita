// *************** IMPORT LIBRARY ***************
const Mongoose = require("mongoose");

// *************** Define Mongoose schema for the Test collection
const StudentTestResultSchema = new Mongoose.Schema(
  {
    // reference to the Student who took the test
    student_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    // reference to the Test the result belongs to
    test_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },
    // Student Test Result's marks
    marks: [
      {
        // Description of the notation, e.g., "Clarity of explanation”
        notation_text: {
          type: String,
          required: true,
        },
        // the mark received by the student for this notation
        mark: {
          type: Number,
          required: true,
        },
      },
    ],
    // The calculated average mark
    average_mark: {
      type: Number,
    },
    // The date the marks were entered
    mark_entry_date: {
      type: Date,
    },
    // Reference to the person who update the test data
    updated_by: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Reference to the person who delete the test data
    deleted_by: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Reference to the time when task deleted
    due_date: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically adds update_at fields
    timestamps: {
      updatedAt: "updated_at",
    },
  }
);

// *************** EXPORT MODULE ***************
module.exports = Mongoose.model("StudentTestResult", StudentTestResultSchema);
