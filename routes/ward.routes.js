const wardController = require('../controllers/ward.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const permission = require('../middlewares/authService.middleware')
const validator = require('../validator/ward.validator');

module.exports = function(router){
    router.post('/ward',authMiddleware.verifyToken,permission.isValidUserToEditData, validator.validateWard,wardController.wardnew);

    router.get('/wardbyPk/:id',authMiddleware.verifyToken,permission.isValidUserToFetchData,wardController.wardDataByPk);

    router.put('/ward/:id',authMiddleware.verifyToken,permission.isValidUserToEditData,validator.validateWard,wardController.updatedWardData);

    router.delete('/ward/:id',authMiddleware.verifyToken,permission.isValidUserToEditData,wardController.deletedWardData);

    router.get('/warddata',authMiddleware.verifyToken,permission.isValidUserToFetchData,wardController.allwardsData);

    return router
};