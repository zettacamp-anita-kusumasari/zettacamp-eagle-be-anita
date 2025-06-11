// *************** IMPORT CORE ***************
const Joi = require('joi');

// *************** Define and export the validation schema for school input data
exports.schoolInputSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(3).max(200).optional(),
  city: Joi.string().min(3).max(50).required(),
  country: Joi.string().min(3).max(50).required(),
  postal_code: Joi.string().min(3).max(50).required()
});

// *************** EXPORT MODULE ***************
module.exports = schoolInputSchema;