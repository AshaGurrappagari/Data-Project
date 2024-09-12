
let express = require('express')
let router = express.Router()
let regionnew = require('../controllers/regionController')

router.get('/region',(req,res)=>{
    res.send(`<h1>Welcome to Region page</h1>
        <form action='/region' method='post' >
        <label for='region'>Region:</label>
        <input type='text' id = 'region' name='region'/></br>
        <input type='submit' value='submit'/>
        </form>
        `)
})

router.post('/region', regionnew)
module.exports = router