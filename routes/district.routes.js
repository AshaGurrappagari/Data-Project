const districtController = require('../controllers/district.controller');

module.exports = function (router){

    router.post('/district', districtController.districtnew);

    router.get('/districtData',districtController.alldistrictsData);

    router.get('/districtByPK/:id', districtController.districtDataByPk);

    router.put('/district/:id',districtController.updatedDistrictData);

    router.delete('/district/:id',districtController.deletedDistrictsData);

    return router;
};