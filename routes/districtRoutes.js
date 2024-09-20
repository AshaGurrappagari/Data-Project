
const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtController');

router.get('/district',(req,res)=>{
    res.send(`<h1>Welcome to district page</h1>
        <form action='/district/1' method='post' >
        <label for='district'>district:</label>
        <input type='text' id = 'district' name='district'/></br>
        <input type='submit' value='submit'/>
        </form>
        `);
});

router.post('/district/:id', districtController.districtnew);
router.get('/districtByPK/:id',districtController.districtDataByPk);
router.get('/districtById/:id',districtController.districtDataById);

module.exports = router;