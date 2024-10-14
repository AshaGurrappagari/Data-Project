const regionController = require('../controllers/region.controller');

module.exports = function (router){
    
router.post('/region', regionController.regionnew),

router.get('/regionData', regionController.allregionData),

router.get('/regionbyPk/:id', regionController.regionDataByPk),

router.put('/region/:id', regionController.updatedRegiondata),

router.delete('/region/:id',regionController.deletedRegiondata)

return router

};
