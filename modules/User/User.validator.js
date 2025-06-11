// *************** IMPORT CORE ***************
const Joi = require('joi');

// *************** Define and export the validation schema for user input data
exports.userInputSchema = Joi.object({
  firstName: Joi.string().min(3).max(100).required(),
  lastName: Joi.string().min(3).max(100).required(),
  email: Joi.string().min(5).max(50).required(),
  role: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(5).max(50).required()
});

// *************** EXPORT MODULE ***************
module.exports = userInputSchema;