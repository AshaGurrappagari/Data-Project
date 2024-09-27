
const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

router.get('/region', (req, res) => {
    res.send(`
        <h1>Welcome to the Region page</h1>
        <form action='/region' method='post'>
            <label for='region'>Region:</label>
            <input type='text' id='region' name='region'/><br/>
            <input type='submit' value='Submit'/>
        </form>
    `);
});

router.post('/region', regionController.regionnew);

router.get('/regionData', regionController.allregionData);

router.get('/regionbyPk/:id', regionController.regionDataByPk);

router.put('/region/:id', regionController.updatedRegiondata);

router.delete('/region/:id',regionController.deletedRegiondata);

module.exports = router;
