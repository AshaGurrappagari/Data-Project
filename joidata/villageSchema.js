const joi = require('joi');

const villageSchema = joi.object({
    village_id: joi.number().integer().optional(), 
    region: joi.string().required(), 
    district: joi.string().required(), 
    ward: joi.string().required(), 
    village: joi.string().required(), 
    minCurrent: joi.number().integer().required(), 
    maxCurrent: joi.number().integer().required(), 
    minLast: joi.number().integer().required(), 
    maxLast: joi.number().integer().required(), 
    crop: joi.string().required(), 
    variety: joi.string().required()
});

module.exports = villageSchema;

