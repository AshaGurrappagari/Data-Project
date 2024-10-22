const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const validator = require("../validator/users.validator")

module.exports = function(router){
    router.post('/user',validator.validateUser,userController.createUser)
    router.post('/userRole',authMiddleware.verifyToken,validator.validateApplication,userController.createRole)
    router.post('/login',userController.userLogin)
    return router;
}
