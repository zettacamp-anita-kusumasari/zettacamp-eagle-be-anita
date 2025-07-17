// *************** IMPORT LIBRARY ***************
const Mongoose = require("mongoose");

// *************** Define Mongoose schema for the Task collection
const TaskSchema = new Mongoose.Schema(
  {
    // Reference to the task this task belongs to
    test_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },
    // Reference to the User this task belongs to
    user_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Reference to the student test result this task belongs to
    student_test_result_ids: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "StudentTestResult",
    },
    // reference to the Student who took the test
    student_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    // The type of task, is it "Assign_Corrector", "Enter_Marks", or "Validate_Marks"
    task_type: {
      type: String,
      enum: ["ASSIGN_CORRECTOR", "ENTER_MARKS", "VALIDATE_MARKS"],
      required: true,
    },
    // Status of the task, is it ‘PENDING’, ‘IN_PROGRESS’, or ‘DELETED’
    task_status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "DELETED"],
      required: true,
    },
    // Due date of the task
    due_date: {
      type: Date,
      required: true,
    },
    // Reference to the person who create the task data
    created_by: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Reference to the person who update the task data
    updated_by: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Reference to the person who delete the task data
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
    // Automatically adds created_at, updateAt, deleted_at fields
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// *************** EXPORT MODULE ***************
module.exports = Mongoose.model("Task", TaskSchema);
