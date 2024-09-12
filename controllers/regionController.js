const sequelize = require('../config/database')
const regionData = require('../services/regionservice');

let regionnew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await regionData(req,transaction)
        if(result.error){
            await transaction.rollback();
            return res.status(500).send('Error in inserting')
        }
        else{
            await transaction.commit();
            return res.status(200).send('Region Data inserted successfully')
        }
    }
    catch(error){
        console.log('error in giving region',err)
        return res.status(500).send('Error Occurred while inserting')
    }

}

module.exports = regionnew
