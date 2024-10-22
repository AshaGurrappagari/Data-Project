const joi = require('joi');
const constants = require('../commons/constants');
const statusCode = require('../utils/statusCode');
const response = require('../errorHandler/response');

module.exports = {
    validateDistrict
}
function validateDistrict (req,res,next){
    const request = joi.object({
        district_id: joi.number().not(0).optional().label("please pass valid input"),
        region: joi.string().pattern(constants.regExp, "valid character").optional().label("please pass valid input"),
        district: joi.string().pattern(constants.regExp, "valid character").optional().label("please pass valid input")

    })
    let validateResult = request.validate(req.body)
    if (validateResult.error) {
        let errorMessage = validateResult.error.details[0].context.label || constants.INVALID_DATA_ERROR_MSG;
        let displayMessage = errorMessage;
        if (["district_id","district","region"].includes(errorMessage) || validateResult.error.details[0].type === "object.allowUnknown") {
            displayMessage = constants.BAD_REQUEST_MSG;
          }
        return res.status(statusCode.BAD_REQUEST).send(response.errorWith(statusCode.BAD_REQUEST, errorMessage, displayMessage));
    }
    next();
}
  
