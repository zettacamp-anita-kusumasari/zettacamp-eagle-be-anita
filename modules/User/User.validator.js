// *************** IMPORT CORE ***************
const Joi = require('joi');

// *************** export school input schema for validation 
exports.userInputSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  role: Joi.string().required(),
  password: Joi.string().required()
});
