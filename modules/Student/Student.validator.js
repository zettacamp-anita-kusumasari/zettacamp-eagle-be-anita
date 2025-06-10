// *************** IMPORT CORE ***************
const Joi = require('joi');

// *************** export school input schema for validation 
exports.studentInputSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  dateOfBirth: Joi.date().optional(),
  schoolId: Joi.date().required()
});