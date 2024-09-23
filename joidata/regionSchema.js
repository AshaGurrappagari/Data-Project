const joi = require('joi');
const constants = require('../commons/constants');

const letters = constants.regExp;

const regionSchema = joi.object({
    region_id: joi.number().integer().optional(), 
    region: joi.string()
        .regex(letters, 'valid characters') 
        .required()
        .messages({
            'string.pattern.name': 'Region must contain only Alphabets and spaces', 
            'any.required': 'Region is required'
        })
});

module.exports = regionSchema;