const districtController = require('../controllers/district.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const permission = require('../middlewares/authService.middleware')
const validator = require('../validator/district.validator')

module.exports = function (router){

    router.post('/district',authMiddleware.verifyToken,permission.isValidUserToEditData,validator.validateDistrict, districtController.districtnew);

    router.get('/districtData',authMiddleware.verifyToken,permission.isValidUserToFetchData,districtController.alldistrictsData);

    router.get('/districtByPK/:id',authMiddleware.verifyToken,permission.isValidUserToFetchData, districtController.districtDataByPk);

    router.put('/district/:id',authMiddleware.verifyToken,permission.isValidUserToEditData,validator.validateDistrict,districtController.updatedDistrictData);

    router.delete('/district/:id',authMiddleware.verifyToken,permission.isValidUserToEditData,districtController.deletedDistrictsData);

    return router;
};