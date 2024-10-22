const Joi = require('joi');
const { BAD_REQUEST } = require('../utils/statusCode');

module.exports = {
    validateApplication: function (req, res, next) {
        const applicationValidator = Joi.object({
            user_id: Joi.number()
                .greater(0)
                .label('User ID')
                .optional()
                .messages({
                    'number.greater': '{#label} must be greater than 0',
                    'any.required': '{#label} is required',
                }),
            application_id: Joi.number()
                .greater(0)
                .label('application ID')
                .optional()
                .messages({
                    'number.greater': '{#label} must be greater than 0',
                    'any.required': '{#label} is required',
                }),
            permission: Joi.string()
                .valid('Global Admin', 'Super Admin', 'Viewer')
                .label('Permission')
                .required()
                .messages({
                    'string.pattern.name': '{#label} must contain only alphabets and spaces',
                    'any.required': '{#label} is required',
                }),
        }).options({ abortEarly: false });

        const { error, value } = applicationValidator.validate(req.body);

        if (error) {
            const errorMessages = error.details.map((err) => err.message);
            return res.status(BAD_REQUEST).json({
                message: 'Validation failed',
                errors: errorMessages,
            });
        }
        req.validatedData = value; 
        next(); 
    },
}

