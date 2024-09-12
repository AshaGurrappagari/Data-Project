
let express = require('express')
let router = express.Router()
let wardnew = require('../controllers/wardController')

router.get('/ward',(req,res)=>{
    res.send(`<h1>Welcome to ward page</h1>
        <form action='/ward/1' method='post' >
        <label for='ward'>ward:</label>
        <input type='text' id = 'ward' name='ward'/></br>
        <input type='submit' value='submit'/>
        </form>
        `)
})
router.post('/ward/:id', wardnew)

module.exports = router