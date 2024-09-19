
const express = require('express')
const router = express.Router()
const {districtnew,districtDataByPk, districtDataById} = require('../controllers/districtConteoller')

router.get('/district',(req,res)=>{
    res.send(`<h1>Welcome to district page</h1>
        <form action='/district/1' method='post' >
        <label for='district'>district:</label>
        <input type='text' id = 'district' name='district'/></br>
        <input type='submit' value='submit'/>
        </form>
        `)
})

router.post('/district/:id', districtnew)
router.get('/districtByPK/:id',districtDataByPk)
router.get('/districtById/:id',districtDataById)

module.exports = router