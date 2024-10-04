
const express = require('express');
const router = express.Router();
const villageController = require('../controllers/villageController');

router.get('/village',(req,res)=>{
    res.send(`<h1>Welcome to ward page</h1>
        <form action='/village' method='post' >
        <label for='region'>region:</label>
        <input type='text' id = 'region' name='region'/></br>
        <label for='district'>district:</label>
        <input type='text' id = 'district' name='district'/></br>
        <label for='ward'>ward:</label>
        <input type='text' id = 'ward' name='ward'/></br>
        <label for='village'>village:</label>
        <input type='text' id = 'village' name='village'/></br>
        <label for='minCurrent'>Min(Current):</label>
        <input type='text' id = 'minCurrent' name='minCurrent'/></br>
        <label for='maxCurrent'>Max(Current):</label>
        <input type='text' id = 'maxCurrent' name='maxCurrent'/></br>
        <label for='minLast'>Min(Last):</label>
        <input type='text' id = 'minLast' name='minLast'/></br>
        <label for='maxLast'>Max(Last):</label>
        <input type='text' id = 'maxLast' name='maxLast'/></br>
        <label for='crop'>Crop:</label>
        <input type='text' id = 'crop' name='crop'/></br>
        <label for='variety'>variety:</label>
        <input type='text' id = 'variety' name='variety'/></br>
        <input type='submit' value='submit'/>
        </form>
        `);
});

router.post('/village', villageController.villagenew);

router.get('/village/:id', villageController.villageByPK);

router.put('/village/:id',villageController.updatedvillagedata);

router.delete('/village/:id',villageController.deletedvillagedata);

router.get('/paginatedData',villageController.allvillageData);

router.get('/villageName', villageController.databyVllageName);

router.get('/villageByWard', villageController.villagebyward);

router.get('/villageregion', villageController.fetchRegions);

router.get('/wardsByVillage', villageController.fetchWardsData);

module.exports = router;

//change post request 