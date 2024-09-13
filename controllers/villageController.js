const sequelize = require('../config/database')
const {Datavillage,villageQuery,villageDatafiltered} = require('../services/villageservice')
const {getStatusCode, statusCodes} = require('../utils/statusCode')


let villagenew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await Datavillage(req,transaction)
        if(result.err){
            await transaction.rollback()
            return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"Failed to create new Village"})
        }
        else{
         await transaction.commit();
         return res.status(getStatusCode('SUCCESS')).json({message:"Village created successfully", data:result})
        }
    }
    catch(err){
        console.log('error while inserting village',err)
        return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"An error occurred while creating village"})
    }
}

let villageData = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await villageQuery(req,res,transaction)
        if(result.err){
            await transaction.rollback()
            return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"Error in Query"})
        }
        else{
         await transaction.commit();
         return res.status(getStatusCode('SUCCESS')).json({message:"Query Executed successfully", data:result})
        }
    }
        catch(err){
            console.log('error in fetching village',err)
            return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"Error in Fetching"})
        }
    
}

let villageFilteredData = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await villageDatafiltered(req,res,transaction)
        if(result.error){
            await transaction.rollback()
            return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"Error in Query"})
        }
        else{
            await transaction.commit();
            return res.status(getStatusCode('SUCCESS')).json({message:"Query Executed successfully", data:result})
        }
    }
    catch(err){
        console.log('error in fetching village',err)
        return res.status(getStatusCode('INTERNAL_SERVER_ERROR')).json({message:"Error in Fetching"})

    }
}

module.exports = {villagenew,villageData,villageFilteredData}

