const sequelize = require('../config/database')
const wardData = require('../services/wardservice');
const {getStatusCode, statusCodes} = require('../utils/statusCode')

let wardnew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await wardData(req,transaction)
        if(result.error){
            await transaction.rollback()
            return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"Failed to create new ward"})
        }
        else{
         await transaction.commit();
         return res.status(getStatusCode('SUCCESS')).json({message:"ward created successfully", data:result})
        }
    }
    catch(error){
        console.log('error in giving ward',err)
        return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"An error occurred while creating ward"})
    }
}

module.exports = wardnew

