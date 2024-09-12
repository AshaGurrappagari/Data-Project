const sequelize = require('../config/database')
const districtData = require('../services/districtservice');


let districtnew = async (req,res)=>{
    try{
       const transaction = await sequelize.transaction();
       const result = await districtData(req,transaction)
       if(result.error){
        await transaction.rollback()
        return res.status(500).send('Error in inserting')
       }
       else{
        await transaction.commit();
        return res.status(200).send('District Data inserted successfully')
       }
    }
    catch(err){
        console.log('error in giving district',err)
        res.status(500).send('Error while inserting')
    }
}

module.exports = districtnew

