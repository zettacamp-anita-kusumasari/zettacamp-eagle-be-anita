// *************** IMPORT LIBRARY ***************
const Mongoose = require("mongoose");

// *************** Define Mongoose schema for the Block collection
const BlockSchema = new Mongoose.Schema(
  {
    // Name of the block for identification
    name: {
      type: String,
      required: true,
    },
    // Description of the block for overview
    description: {
      type: String,
      required: true,
    },
    // A list of IDs referencing the Subject documents related to this Block
    subject_ids: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    // A list of ID referencing the School documents related to this Block
    school_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    // A list of ID referencing the User documents related to this Block
    user_id: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The academic year for this block
    academic_year: {
      type: Number,
      required: true,
    },
    // A short, unique code for internal or display use
    block_code: {
      type: String,
      required: true,
    },
    // Status of the block, is it ‘ACTIVE’ or ‘DELETED’
    block_status: {
      type: String,
      enum: ["ACTIVE", "DELETED"],
      required: true,
    },
    // The type of the block, is it ‘REGULER’, ‘PROFESSIONAL’, ‘SOFT_SKILL’, and ‘RETAKE’
    block_type: {
      type: String,
      enum: ["REGULER", "PROFESSIONAL", "SOFT_SKILL", "RETAKE"],
      required: true,
    },
    // The assessment’s form of the evaluation, is it ‘COMPETENCY’ or ‘SCORE’
    evaluation_assessment: {
      type: String,
      enum: ["COMPETENCY", "SCORE"],
      required: true,
    },
    // Reference to the person who create the block data
    created_by: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Reference to the person who update the block data
    updated_by: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Reference to the person who delete the block data
    deleted_by: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    // Automatically adds created_at, updateAt, and deleted_at fields
    timestamps: {
      created_at: "Created_At",
      updated_at: "Updated_At",
      deleted_at: "Deleted_At",
    },
  }
);

// *************** EXPORT MODULE ***************
module.exports = Mongoose.model("Block", BlockSchema);
