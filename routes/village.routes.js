const villageController = require('../controllers/village.controller');



module.exports = function (router){
    router.post('/village', villageController.villagenew);

    router.get('/village/:id', villageController.villageByPK);

    router.put('/village/:id',villageController.updatedvillagedata);

    router.delete('/village/:id',villageController.deletedvillagedata);

    router.get('/paginatedData',villageController.allvillageData);

    router.get('/villageName', villageController.databyVllageName);

    router.get('/villageByWard', villageController.villagebyward);

    router.get('/villageregion', villageController.fetchRegions);

    router.get('/wardsByVillage', villageController.fetchWardsData);
    
    return router;
};

