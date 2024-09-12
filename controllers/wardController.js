const sequelize = require('../config/database')
const wardData = require('../services/wardservice');

let wardnew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await wardData(req,transaction)
        if(result.error){
            await transaction.rollback()
            return res.status(500).send('Error in inserting')
        }
        else{
         await transaction.commit();
         return res.status(200).send('Ward Data inserted successfully')
        }
    }
    catch(error){
        console.log('error in giving ward',err)
        res.status(500).send('Error while inserting ward Data')
    }
}

module.exports = wardnew

