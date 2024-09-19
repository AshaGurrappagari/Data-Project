
const express = require('express')
const router = express.Router()
const {wardnew, wardDataById, wardDataByPk} = require('../controllers/wardController')

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
router.get('/wardbyId/:id',wardDataById)
router.get('/wardbyPk/:id',wardDataByPk)
module.exports = router