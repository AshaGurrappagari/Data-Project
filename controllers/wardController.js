const sequelize = require('../config/database')
const wardService = require('../services/wardservice');
const {SUCCESS_CODE,NOT_FOUND,SERVER_ERROR,DATA_ALREADY_EXISTS,BAD_REQUEST} = require('../utils/statusCode')
const response = require('../errorHandler/response');
const customException = require('../errorHandler/customException');

const wardnew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await wardService.wardData(req,transaction)
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage))
        }
        else{
            await transaction.commit();
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','wards created successfully'))
        }
        }
        catch(err){
            console.log('error in giving ward',err)
            return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while creating wards'))
        }
}
const wardDataById = async (req,res) => {
    try{
        const result = await wardService.wardById(req)
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage))
        }
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','wards fetched successfully'))
    }
    catch(err){
        console.log('error in fetching ward',err)
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching wards'))
    }
}

const wardDataByPk = async (req,res) => {
    try{
        const result = await wardService.wardByPk(req)
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage))
        }
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','wards fetched successfully'))
    }
    catch(err){
        console.log('error in fetching ward',err)
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching wards'))
    }
}


module.exports = {wardnew,wardDataById,wardDataByPk}

