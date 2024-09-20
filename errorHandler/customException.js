const { messages } = require("../utils/errmessage");
const { BAD_REQUEST, SERVER_ERROR } = require("../utils/statusCode");

module.exports = {
    error : (httpStatusCode,message,displayMessage,customData, customStatusCode) => {

        if(!httpStatusCode){
            httpStatusCode = SERVER_ERROR;
        }
        if(!customStatusCode){
            return {
                httpStatusCode,
                message, 
                displayMessage}
        }
        // if(!message){
        //     message =null;
        // }
        // if(!displayMessage){
        //     displayMessage = messages.notCreated;
        // }
        return {
            httpStatusCode,
            message,
            displayMessage,
            customStatusCode,
            customData
        }
    }
}