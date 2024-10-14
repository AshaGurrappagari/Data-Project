const joi = require('joi');
const constants = require('../commons/constants');

const letters = constants.regExp;

const wardSchema = joi.object({
    ward_id: joi.number().integer().optional(), 
    ward: joi.string()
        .regex(letters, 'valid characters') 
        .required()
        .messages({
            'string.pattern.name': 'District must contain only Alphabets and spaces', 
            'any.required': 'district is required'
        }),
    district: joi.string().required()
});

module.exports = wardSchema;