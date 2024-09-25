
const express = require('express');
const router = express.Router();
const wardController = require('../controllers/wardController');

router.get('/ward',(req,res)=>{
    res.send(`<h1>Welcome to ward page</h1>
        <form action='/ward/1' method='post' >
        <label for='ward'>ward:</label>
        <input type='text' id = 'ward' name='ward'/></br>
        <input type='submit' value='submit'/>
        </form>
        `);
});

router.post('/ward/:id', wardController.wardnew);

router.get('/wardbyId/:id', wardController.wardDataById);

router.get('/wardbyPk/:id', wardController.wardDataByPk);

module.exports = router;