const constants = require('../commons/constants');
const { SUCCESS_CODE, SERVER_ERROR } = require('../utils/statusCode');

module.exports = {
    successWith : (httpStatusCode,data,message,displayMessage, customStatusCode,customData) => {
        if(!data){
            data = null;
        }
        if(!httpStatusCode){
            httpStatusCode = SUCCESS_CODE;
        }
        if(!message){
            message =null;
        }
        if(!displayMessage){
            displayMessage = constants.SomethingWrong; 
        }
        if(!customStatusCode){
            customStatusCode = null;
        }
        if(!customData){
            customData=null;
        }
        return {
            httpStatusCode,
            customStatusCode,
            result:{data,customData},
            message,
            displayMessage,
            status:'OK'
        };
    },
    errorWith : (httpStatusCode,message,displayMessage, customStatusCode) => {
        if(!httpStatusCode){
            httpStatusCode = SERVER_ERROR;
        }
        if(!message){
            message =null;
        }
        if(!displayMessage){
            displayMessage = constants.unknownErrorMessage;
        }
        if(!customStatusCode){
            customStatusCode = null;
        }
        return {
            httpStatusCode,
            message,
            displayMessage,
            customStatusCode,
            status:'Failure'
        };
    }
};