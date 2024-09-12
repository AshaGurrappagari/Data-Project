
let express = require('express')
let router = express.Router()
let districtnew = require('../controllers/districtConteoller')

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
module.exports = router