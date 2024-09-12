
const sequelize = require('../config/database')
const district = require('../models/district')

let districtData = async (req,t)=>{
try{
    let districtData = req.body.district;
    let regionId = req.params.id
    let newdistrict = await district.create(
        {
            district:districtData,
            regionId :regionId
        },{transaction:t})
    console.log('District created',newdistrict)
    return newdistrict
}
catch(err){
    console.log('error in giving district',err)
    return err
}
}

module.exports = districtData
