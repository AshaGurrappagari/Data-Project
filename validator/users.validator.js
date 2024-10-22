const joi = require('joi');
const constants = require('../commons/constants');
const statusCode = require('../utils/statusCode');
const response = require('../errorHandler/response');
const customStatusCode = require('../utils/customStatusCodes')

module.exports = {
    validateUser,validateApplication
    }
    function validateUser (req,res,next){
    const request = joi.object({
        user_id: joi.number().not(0).optional().label("please pass valid input"),
        first_name: joi.string().pattern(constants.regExp, "valid character").optional().label("please pass valid input"),
        last_name: joi.string().pattern(constants.regExp, "valid character").optional().label("please pass valid input"),
        email: joi.string().pattern(constants.emailExp, "valid character").optional().label("please pass valid input"),
        password: joi.string().optional().label("please pass valid input"),

    });
    let validateResult = request.validate(req.body)

    if (validateResult.error) {
        let errorMessage = validateResult.error.details[0].context.label || constants.INVALID_DATA_ERROR_MSG;
        let displayMessage = errorMessage;
        if (["user_id","first_name","last_name","email","password"].includes(errorMessage) || validateResult.error.details[0].type === "object.allowUnknown") {
          displayMessage = constants.BAD_REQUEST_MSG;
        }
        return res.status(statusCode.BAD_REQUEST).send(response.errorWith(statusCode.BAD_REQUEST, errorMessage, displayMessage,customStatusCode.INVALID_FIELD_VALUES));
      }
      next();
    }
    function validateApplication (req,res,next){
        const request = joi.object({
            application_id: joi.number().not(0).optional().label("please pass valid input"),
            targetUserId: joi.number().not(0).optional().label("please pass valid input"),
            permission: joi.string().valid('Global Admin', 'Super Admin', 'Viewer').optional().label("please pass valid input"),    
        });
        let validateResult = request.validate(req.body)
    
        if (validateResult.error) {
            let errorMessage = validateResult.error.details[0].context.label || constants.INVALID_DATA_ERROR_MSG;
            let displayMessage = errorMessage;
            if (["user_id","first_name","last_name","email","password"].includes(errorMessage) || validateResult.error.details[0].type === "object.allowUnknown") {
              displayMessage = constants.BAD_REQUEST_MSG;
            }
            return res.status(statusCode.BAD_REQUEST).send(response.errorWith(statusCode.BAD_REQUEST, errorMessage, displayMessage,customStatusCode.INVALID_FIELD_VALUES));
          }
        next();
    }

// module.exports = {
//     validateUser: function (req, res, next) {
//         const userValidator = joi.object({
//             user_id: joi.number().greater().optional()                
//             .label('User ID')
//             .messages({
//                 'number.greater': '{#label} must be greater than 0',
//                 'any.required': '{#label} is required',
//             }), 
//             first_name: joi.string().regex(constants.regExp, 'valid characters') .required()
//             .label('First Name')
//             .messages({
//                 'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                 'any.required': '{#label} is required',
//             }),
//             last_name: joi.string().regex(constants.regExp,'valid characters').required()
//             .label('Last Name')
//             .messages({
//                 'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                 'any.required': '{#label} is required',
//             }),
//             email: joi.string().regex(constants.emailExp,'valid characters').required()
//             .label('Email')
//             .messages({
//                 'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                 'any.required': '{#label} is required',
//             }),
//             password: joi.string().required()                
//             .label('Password')
//             .messages({
//                 'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                 'any.required': '{#label} is required',
//             }),
//         }).options({ abortEarly: false });

//         const { error, value } = userValidator.validate(req.body);

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
//         validateApplication: function (req, res, next) {
//         const applicationValidator = joi.object({
//             targetUserId: joi.number()
//                 .greater(0)
//                 .label('targetUserId')
//                 .optional()
//                 .messages({
//                     'number.greater': '{#label} must be greater than 0',
//                     'any.required': '{#label} is required',
//                 }),
//             application_id: joi.number()
//                 .greater(0)
//                 .label('application ID')
//                 .optional()
//                 .messages({
//                     'number.greater': '{#label} must be greater than 0',
//                     'any.required': '{#label} is required',
//                 }),
//             permission: joi.string()
//                 .valid('Global Admin', 'Super Admin', 'Viewer')
//                 .label('Permission')
//                 .required()
//                 .messages({
//                     'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                     'any.required': '{#label} is required',
//                 }),
//         }).options({ abortEarly: false });

//         const { error, value } = applicationValidator.validate(req.body);

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

