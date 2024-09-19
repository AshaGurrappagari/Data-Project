const { messages } = require("../utils/errmessage");
const { BAD_REQUEST } = require("../utils/statusCode");

module.exports = {
    error : (httpStatusCode,message,displayMessage) => {

        if(!httpStatusCode){
            httpStatusCode = BAD_REQUEST;
        }
        if(!message){
            message =null;
        }
        if(!displayMessage){
            displayMessage = messages.notCreated;
        }
        return {
            httpStatusCode,
            message,
            displayMessage,
            status:'Failure'
        }
    }
}