const { messages } = require("../utils/errmessage");
const { SUCCESS_CODE, SERVER_ERROR } = require("../utils/statusCode");

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
            displayMessage = messages.Success;
        }
        // if(!customStatusCode){
        //     customStatusCode = null;
        // }
        // if(!customData){
        //     customData=null
        // }
        return {
            httpStatusCode,
            // customStatusCode,
            result:{data},
            message,
            displayMessage,
            status:'OK'
        }
    },
    errorWith : (httpStatusCode,message,displayMessage, customStatusCode) => {
        if(!httpStatusCode){
            httpStatusCode = SERVER_ERROR;
        }
        if(!message){
            message =null;
        }
        if(!displayMessage){
            displayMessage = messages.unknownErrorMessage;
        }
        // if(!customStatusCode){
        //     customStatusCode = null;
        // }
        return {
            httpStatusCode,
            // customStatusCode,
            message,
            displayMessage,
            status:'Failure'
        }
    }

}