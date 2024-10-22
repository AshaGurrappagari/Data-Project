const jwt = require('jsonwebtoken');
const application = require('../models/userRole.model');
const jwt_secret = process.env.jwt_secret;

module.exports = {
    verifyToken: async (req, res, next) => {
        const token = req.headers['x-access-token']; 
        console.log('token===========>',token)
        if (!token) return res.status(401).json({message: 'Access denied. No token provided.',displayMessage: 'Please log in to access this resource'});
        try {
            const payload = jwt.verify(token, jwt_secret); 
            const userRole = await application.findOne({
                where: { userId: payload.userId }
            });

            req.user = { userId: userRole.userId, role: userRole.permission };
            next(); 
        } 
        catch (err) {
            return res.status(403).json({message: 'Invalid or expired token',displayMessage: 'Please log in again'});
        }
    }
};
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiQXNoYUB5b3BtYWlsLmNvbSIsImlhdCI6MTcyOTE2NjEzNiwiZXhwIjoxNzI5MTY5NzM2fQ.kpzP4-LUqkY57w7MgcaoqBCW1q2YWQy7I_cqz75yhvA