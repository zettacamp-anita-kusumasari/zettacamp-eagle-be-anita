// *************** IMPORT CORE ***************
const Joi = require('joi');

// *************** export school input schema for validation 
exports.schoolInputSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().optional()
});