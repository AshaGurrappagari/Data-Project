// joidata/villageSchema.js
const Joi = require('joi');

const villageSchema = Joi.object({
    region: Joi.string().trim().required(),
    district: Joi.string().trim().required(),
    ward: Joi.string().trim().required(),
    village: Joi.string().trim().required(),
    minCurrent: Joi.number().integer().required(),
    maxCurrent: Joi.number().integer().required(),
    minLast: Joi.number().integer().required(),
    maxLast: Joi.number().integer().required(),
    crop: Joi.string().trim().required(),
    variety: Joi.string().trim().required()
});

module.exports = villageSchema;
