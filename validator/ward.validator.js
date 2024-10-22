const joi = require('joi');
const constants = require('../commons/constants');
const statusCode = require('../utils/statusCode');
const response = require('../errorHandler/response');

module.exports = {
    validateWard
}
function validateWard (req,res,next){
    const request = joi.object({
        ward_id: joi.number().not(0).optional().label("please pass valid input"),
        ward: joi.string().pattern(constants.regExp, "valid character").optional().label("please pass valid input"),
        district: joi.string().pattern(constants.regExp, "valid character").optional().label("please pass valid input")

    })
    let validateResult = request.validate(req.body)
    if (validateResult.error) {
        let errorMessage = validateResult.error.details[0].context.label || constants.INVALID_DATA_ERROR_MSG;
        let displayMessage = errorMessage;
        if (["ward_id","district","ward"].includes(errorMessage) || validateResult.error.details[0].type === "object.allowUnknown") {
            displayMessage = constants.BAD_REQUEST_MSG;
          }
        return res.status(statusCode.BAD_REQUEST).send(response.errorWith(statusCode.BAD_REQUEST, errorMessage, displayMessage));
    }
    next();
}


// module.exports = {
//     validateWard: function (req, res, next) {
//         const wardValidator = Joi.object({
//             ward_id: Joi.number()
//                 .greater(0)
//                 .label('Ward ID')
//                 .optional()
//                 .messages({
//                     'number.greater': '{#label} must be greater than 0',
//                     'any.required': '{#label} is required',
//                 }),

//             ward: Joi.string()
//                 .regex(constants.regExp, 'valid characters')
//                 .label('Ward Name')
//                 .required()
//                 .messages({
//                     'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                     'any.required': '{#label} is required',
//                 }),
//             district: Joi.string()
//                 .regex(constants.regExp, 'valid characters')
//                 .label('district Name')
//                 .optional()
//                 .messages({
//                     'string.pattern.name': '{#label} must contain only alphabets and spaces',
//                     'any.required': '{#label} is required',
//             }),

//         }).options({ abortEarly: false });

//         const { error, value } = wardValidator.validate(req.body);

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

