const constants = require("../commons/constants");

module.exports = {
    isValidUserToEditData: async (req, res, next) => {
        try {
            if (req.user.role === constants.globalAdmin) return next();
            console.log('valid user ==>',req.user.role)
            return res.status(403).json({message: 'Access denied',displayMessage: 'You do not have permission to edit this resource'});
        } 
        catch (err) {
            console.error('Authorization error:', err);
            return res.status(500).json({message: 'Internal server error',displayMessage: 'Something went wrong, please try again later'});
        }
    },
    isValidUserToFetchData: async (req, res, next) => {
        try {

            if (req.user.role === constants.superAdmin|| req.user.role === constants.globalAdmin) return next();
            console.log('valid user ==>',req.user.role)
            return res.status(403).json({message: 'Access denied',displayMessage: 'You do not have permission to edit this resource'});
        } 
        catch (err) {
            console.error('Authorization error:', err);
            return res.status(500).json({message: 'Internal server error',displayMessage: 'Something went wrong, please try again later'});
        }
    }
};


//user
//swagger
//constants
//validaterole chandges
