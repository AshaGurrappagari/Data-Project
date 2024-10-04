
const express = require('express');
const router = express.Router();
const wardController = require('../controllers/wardController');

router.get('/ward',(req,res)=>{
    res.send(`<h1>Welcome to ward page</h1>
        <form action='/ward' method='post' >
        <label for='ward'>ward:</label>
        <input type='text' id = 'ward' name='ward'/></br>
        <input type='submit' value='submit'/>
        </form>
        `);
});

router.post('/ward', wardController.wardnew);

router.get('/wardbyPk/:id', wardController.wardDataByPk);

router.put('/ward/:id',wardController.updatedWardData);

router.delete('/ward/:id',wardController.deletedWardData);

router.get('/warddata',wardController.allwardsData);

module.exports = router;