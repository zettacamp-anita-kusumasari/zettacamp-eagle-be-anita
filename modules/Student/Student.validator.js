// *************** IMPORT CORE ***************
const Joi = require('joi');

// *************** Define and export the validation schema for student input data 
exports.studentInputSchema = Joi.object({
  firstName: Joi.string().min(3).max(100).required(),
  lastName: Joi.string().min(3).max(100).required(),
  email: Joi.string().min(5).max(50).required(),
  dateOfBirth: Joi.date().required(),
});

// *************** EXPORT MODULE ***************
module.exports = studentInputSchema;