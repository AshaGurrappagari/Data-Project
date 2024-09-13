const statusCodes = {
    SUCCESS:200,
    BAD_REQUEST:400,
    UNAUTHORIZED:401,
    NOT_FOUND:404,
    INTERNAL_SERVER_ERROR:500
}

const getStatusCode = (codeKey) => {
    return statusCodes[codeKey] || statusCodes.INTERNAL_SERVER_ERROR
}

module.exports = {
    statusCodes,
    getStatusCode
}