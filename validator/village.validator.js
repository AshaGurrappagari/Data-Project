const joi = require('joi');
const constants = require('../commons/constants');
const statusCode = require('../utils/statusCode');
const response = require('../errorHandler/response');

module.exports = {
    validateVillage
}
function validateVillage (req,res,next){
    const request = joi.object({
        village_id: joi.number().not(0).optional().label("please pass valid input"),
        region: joi.string().pattern(constants.regExp, "valid character").optional().label("please pass valid input"),
        district: joi.string().pattern(constants.regExp, "valid character").optional().label("please pass valid input"),
        ward: joi.string().pattern(constants.regExp, "valid character").optional().label("please pass valid input"),
        village: joi.string().pattern(constants.regExp, "valid character").optional().label("please pass valid input"),
        minCurrent: joi.number().greater(0).optional().label("please pass valid input"),
        maxCurrent: joi.number().greater(0).optional().label("please pass valid input"),
        minLast: joi.number().greater(0).optional().label("please pass valid input"),
        maxLast: joi.number().greater(0).optional().label("please pass valid input"),
        crop: joi.string().optional().label("please pass valid input"),
        variety: joi.string().optional().label("please pass valid input"),
    })
    let validateResult = request.validate(req.body)
    if (validateResult.error) {
        let errorMessage = validateResult.error.details[0].context.label || constants.INVALID_DATA_ERROR_MSG;
        let displayMessage = errorMessage;
        if (["village_id","region","district","ward","village","minCurrent","minCurrent","minLast","maxLast","crop","variety"].includes(errorMessage) || validateResult.error.details[0].type === "object.allowUnknown") {
            displayMessage = constants.BAD_REQUEST_MSG;
          }
        return res.status(statusCode.BAD_REQUEST).send(response.errorWith(statusCode.BAD_REQUEST, errorMessage, displayMessage));
    }
    next();
}
  
// module.exports = {
//     validateVillage: function (req, res, next) {
//         const villageValidator = Joi.object({
//             village_id: Joi.number()
//                 .greater(0)
//                 .label('Village ID')
//                 .optional()
//                 .messages({
//                     'number.greater': '{#label} must be greater than 0',
//                     'any.required': '{#label} is required',
//                 }),
//             region: Joi.string()
//                 .regex(constants.regExp, 'valid characters')
//                 .label('Region Name')
//                 .required()
//                 .messages({
//                     'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                     'any.required': '{#label} is required',
//                 }),
//             district: Joi.string()
//                 .regex(constants.regExp, 'valid characters')
//                 .label('District Name')
//                 .required()
//                 .messages({
//                     'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                     'any.required': '{#label} is required',
//                 }),
//             ward: Joi.string()
//                 .regex(constants.regExp, 'valid characters')
//                 .label('ward Name')
//                 .required()
//                 .messages({
//                     'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                     'any.required': '{#label} is required',
//                 }),
//             village: Joi.string()
//                 .regex(constants.regExp, 'valid characters')
//                 .label('Village Name')
//                 .required()
//                 .messages({
//                     'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                     'any.required': '{#label} is required',
//                 }),
//             minCurrent: Joi.number()
//                 .label('Minimum Current')
//                 .required()
//                 .messages({
//                     'number.greater': '{#label} must be greater than 0',
//                     'any.required': '{#label} is required',
//                 }),
//             maxCurrent: Joi.number()
//                 .label('Maximum Current')
//                 .required()
//                 .messages({
//                     'number.greater': '{#label} must be greater than 0',
//                     'any.required': '{#label} is required',
//                 }),
//             minLast: Joi.number()
//                 .label('Minimum Last')
//                 .required()
//                 .messages({
//                     'number.greater': '{#label} must be greater than 0',
//                     'any.required': '{#label} is required',
//                 }),
//             maxLast: Joi.number()
//                 .label('Maximum Last')
//                 .required()
//                 .messages({
//                     'number.greater': '{#label} must be greater than 0',
//                     'any.required': '{#label} is required',
//                 }),               
//             crop: Joi.string()
//                 .label('Crop Name')
//                 .required()
//                 .messages({
//                     'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                     'any.required': '{#label} is required',
//                 }),
//             variety: Joi.string()
//                 .label('variety Name')
//                 .required()
//                 .messages({
//                     'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                     'any.required': '{#label} is required',
//                 }),
//         }).options({ abortEarly: false });

//         const { error, value } = villageValidator.validate(req.body);

//         if (error) {
//             const errorMessages = error.details.map((err) => err.message);
//             return res.status(BAD_REQUEST).json({
//                 message: 'Validation failed',
//                 errors: errorMessages,
//             });
//         }
//         req.validatedData = value; 
//         next(); 
//     },
// }
