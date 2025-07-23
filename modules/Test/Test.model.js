// *************** IMPORT LIBRARY ***************
const Mongoose = require("mongoose");

// *************** Define Mongoose schema for the Test collection
const TestSchema = new Mongoose.Schema(
  {
    // reference to the Subject this test belongs to
    subject_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    // Name of the test for identification
    name: {
      type: String,
      required: true,
    },
    // Description of the test for overview
    description: {
      type: String,
      required: true,
    },
    // The weight of the average score
    weight: {
      type: Number,
      required: true,
      min: [0, "Weight cannot be negative"],
    },
    // Test's notations
    notations: [
      {
        // Description or label of the part of the test
        notation_text: {
          type: String,
          required: true,
        },
        // Maximum points that can be scored in this part. Note: cannot be negative
        max_point: {
          type: Number,
          required: true,
          min: [0, "max_point cannot be negative"],
        },
      },
    ],
    // Status of the test, is it 'PUBLISHED', 'NOT_PUBLISHED'
    test_status: {
      type: String,
      enum: ["NOT_PUBLISHED", "PUBLISHED", "DELETED"],
      required: true,
    },
    // Check the test, is it for retake or not
    for_retake: {
      type: Boolean,
      required: true,
    },
    // Reference to the date when the test is published
    published_date: {
      type: Date,
      required: true,
    },
    // Reference to the person who published the test
    published_by: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Reference to the person who create the test data
    created_by: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    // Reference to the date when the test is deleted
    deleted_at: {
      type: Date,
    },
  },
  {
    // Automatically adds createdAt and updateAt fields
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// *************** EXPORT MODULE ***************
module.exports = Mongoose.model("Test", TestSchema);
