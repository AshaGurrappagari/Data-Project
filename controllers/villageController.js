const sequelize = require('../config/database')
const {Datavillage,villageQuery,villageDatafiltered, updateVillage} = require('../services/villageservice')
const {SUCCESS_CODE,NOT_FOUND,SERVER_ERROR,DATA_ALREADY_EXISTS,BAD_REQUEST} = require('../utils/statusCode')
const response = require('../errorHandler/response');
const { messages } = require('../utils/errmessage');
const customException = require('../errorHandler/customException');



const villagenew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await Datavillage(req,transaction)
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage))
        }
        else{
            await transaction.commit();
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{villageD:result.data},messages.Success,'villages created successfully'))
        }
        }
        catch(err){
            console.log('error in giving village',err)
            return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while creating villages'))
        }
}

const villageData = async (req,res)=>{
    try{
        const result = await villageQuery(req,res)
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage))
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{villageD:result.data},messages.Success,'villages fetched successfully'))
    }
    catch(err){
        console.log('error in fetching village',err)
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'))
    }
}

const villageFilteredData = async (req,res)=>{
    try{
        const result = await villageDatafiltered(req,res)
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage))
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{villageD:result.data},messages.Success,'villages fetched successfully'))
    }
    catch(err){
        console.log('error in fetching village',err)
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'))
    }
}
const updatedvillagedata = async (req,res) => {
    try{
        const transaction = await sequelize.transaction()
        const result = await updateVillage(req,transaction)
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage))
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{affectedRows:result.data.affectedRows},messages.Success,'Village Updated Successfully'))
    }
    catch(err){
        console.log('Error in updating village data',err)
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'))
    }
}


module.exports = {villagenew,villageData,villageFilteredData,updatedvillagedata}

