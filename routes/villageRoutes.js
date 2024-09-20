
const express = require('express')
const router = express.Router()
const villageController = require('../controllers/villageController')

router.get('/village',(req,res)=>{
    res.send(`<h1>Welcome to ward page</h1>
        <form action='/village/1/1/1' method='post' >
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
        `)
})
router.post('/village/:id/:districtId/:wardId', villageController.villagenew)
router.get('/village/getdata', villageController.villageData)
router.get('/village/query',villageController.villageFilteredData)
router.post('/village/:id',villageController.updatedvillagedata)
module.exports = router