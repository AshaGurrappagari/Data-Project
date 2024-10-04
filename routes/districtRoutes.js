const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtController');

router.get('/district', (req, res) => {
    res.send(`
        <h1>Welcome to the District page</h1>
        <form action='/district' method='post'>
            <label for='district'>District:</label>
            <input type='text' id='district' name='district'/><br/>
            <input type='submit' value='Submit'/>
        </form>
    `);
});

router.post('/district', districtController.districtnew);

router.get('/districtData',districtController.alldistrictsData);

router.get('/districtByPK/:id', districtController.districtDataByPk);

router.put('/district/:id',districtController.updatedDistrictData);

router.delete('/district/:id',districtController.deletedDistrictsData);

module.exports = router;
