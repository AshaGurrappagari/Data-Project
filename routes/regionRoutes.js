
const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

router.get('/region',(req,res)=>{
    res.send(`<h1>Welcome to Region page</h1>
        <form action='/region' method='post' >
        <label for='region'>Region:</label>
        <input type='text' id = 'region' name='region'/></br>
        <input type='submit' value='submit'/>
        </form>
        `);
});

router.post('/region', regionController.regionnew);
router.get('/regiondata',regionController.regionnewdata);
router.get('/region/:id',regionController.regiondatabyId);
router.get('/regionbyPk/:id',regionController.regionDataByPk);

module.exports = router;