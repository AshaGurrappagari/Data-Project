const joi = require('joi');
const constants = require('../commons/constants');

const letters = constants.regExp;

const districtSchema = joi.object({
    district_id: joi.number().integer().optional(), 
      
    district: joi.string()
        .regex(letters, 'valid characters') 
        .required()
        .messages({
            'string.pattern.name': 'District must contain only Alphabets and spaces', 
            'any.required': 'district is required'
        }),
    region: joi.string().required()
});

module.exports = districtSchema;