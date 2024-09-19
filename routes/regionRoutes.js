
const express = require('express')
const router = express.Router()
const {regionnew,regionnewdata, regiondatabyId, regionDataByPk} = require('../controllers/regionController')

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
router.get('/regiondata',regionnewdata)
router.get('/region/:id',regiondatabyId)
router.get('/regionbyPk/:id',regionDataByPk)
module.exports = router