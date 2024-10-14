const wardController = require('../controllers/ward.controller');

module.exports = function(router){
    router.post('/ward', wardController.wardnew);

    router.get('/wardbyPk/:id', wardController.wardDataByPk);

    router.put('/ward/:id',wardController.updatedWardData);

    router.delete('/ward/:id',wardController.deletedWardData);

    router.get('/warddata',wardController.allwardsData);

    return router
};