const villageController = require('../controllers/village.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const permission = require('../middlewares/authService.middleware');
const validator = require('../validator/village.validator')

module.exports = function (router){
    router.post('/village',authMiddleware.verifyToken,permission.isValidUserToEditData,validator.validateVillage,villageController.villagenew);

    router.get('/village/:id',authMiddleware.verifyToken,permission.isValidUserToFetchData, villageController.villageByPK);

    router.put('/village/:id',authMiddleware.verifyToken,permission.isValidUserToEditData,validator.validateVillage,villageController.updatedvillagedata);

    router.delete('/village/:id',authMiddleware.verifyToken,permission.isValidUserToEditData,villageController.deletedvillagedata);

    router.get('/paginatedData',authMiddleware.verifyToken,permission.isValidUserToFetchData,villageController.allvillageData);

    router.get('/villageName',authMiddleware.verifyToken,permission.isValidUserToFetchData, villageController.databyVllageName);

    router.get('/villageByWard',authMiddleware.verifyToken,permission.isValidUserToFetchData, villageController.villagebyward);

    router.get('/villageregion',authMiddleware.verifyToken,permission.isValidUserToFetchData, villageController.fetchRegions);

    router.get('/wardsByVillage',authMiddleware.verifyToken,permission.isValidUserToFetchData, villageController.fetchWardsData);
    
    return router;
};

// {
//     "region": "India",
//     "district": "andhra Pradesh",
//     "ward": "Tirupati",
//     "village": "SN",
//     "minCurrent": 42000,
//     "maxCurrent": 42000,
//     "minLast": 42000,
//     "maxLast": 42000,
//     "crop": "new crop",
//     "variety": "new variety"
//   }


