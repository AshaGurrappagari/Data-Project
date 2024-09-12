
const sequelize = require('../config/database')
let region = require('../models/region')

let regionData = async (req,t)=>{
    try{
        let regionData = req.body.region;
        let newregion = await region.create(
            {region:regionData},{transaction:t})
        console.log('Region created',newregion)
        return newregion
    }
    catch(error){
        console.log('error in giving region',error)
        return error
    }
}

module.exports = regionData
