const regionController = require('../controllers/region.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const permission = require('../middlewares/authService.middleware')
const validator = require('../validator/region.validator')

module.exports = function (router){

    // router.post('/region', [authMiddleware.vefifyToken, validator.validateCreateRegionData, permission.isValidUserToCreateRegion], controller.createRegion)
router.post('/region', authMiddleware.verifyToken,permission.isValidUserToEditData,validator.validateRegions,regionController.regionnew),

router.get('/regionData', authMiddleware.verifyToken,permission.isValidUserToFetchData,regionController.allregionData),

router.get('/regionbyPk/:id',authMiddleware.verifyToken,permission.isValidUserToFetchData, regionController.regionDataByPk),

router.put('/region/:id',authMiddleware.verifyToken,permission.isValidUserToEditData,validator.validateRegions, regionController.updatedRegiondata),

router.delete('/region/:id',authMiddleware.verifyToken,permission.isValidUserToEditData,regionController.deletedRegiondata)

return router

};

//validate name change
//changes routes, swagger, joi validators- for '0' 
//find or create change