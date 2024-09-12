const sequelize = require('../config/database')
const ward = require('../models/ward')

const wardData = async (req,t) => {
    try{
        let wardData = req.body.ward;
        let districtId = req.params.id
        let newward = await ward.create({
            ward:wardData,
            districtId :districtId
        },{transaction:t})
    console.log('ward creeated',newward)
    return wardData
}
catch(err){
    console.log('error in giving ward',err)
    return err
}
}

module.exports = wardData

