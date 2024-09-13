const sequelize = require('../config/database')
const regionData = require('../services/regionservice');
const {getStatusCode, statusCodes} = require('../utils/statusCode')


let regionnew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await regionData(req,transaction)
        if(result.error){
            await transaction.rollback();
            return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"Failed to create new region"})
        }
        else{
            await transaction.commit();
            return res.status(getStatusCode('SUCCESS')).json({message:"Region created successfully", data:result})
        }
    }
    catch(error){
        console.log('error in giving region',error)
        return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"An error occurred while creating region"})
    }
}

module.exports = regionnew
