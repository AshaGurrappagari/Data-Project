const sequelize = require('../config/database')
const districtData = require('../services/districtservice');
const {getStatusCode, statusCodes} = require('../utils/statusCode')


let districtnew = async (req,res)=>{
    try{
       const transaction = await sequelize.transaction();
       const result = await districtData(req,transaction)
       if(result.error){
        await transaction.rollback()
        return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"Failed to create new District"})
    }
       else{
        await transaction.commit();
        return res.status(getStatusCode('SUCCESS')).json({message:"District created successfully", data:result})
    }
    }
    catch(err){
        console.log('error in giving district',err)
        return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"An error occurred while creating District"})
    }
}

module.exports = districtnew

