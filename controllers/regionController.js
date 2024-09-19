const sequelize = require('../config/database');
const customException = require('../errorHandler/customException');
const response = require('../errorHandler/response');
const {regionData, allregion, regionById, regionByPk} = require('../services/regionservice');
const { messages } = require('../utils/errmessage');
const {SUCCESS_CODE,NOT_FOUND,SERVER_ERROR,DATA_ALREADY_EXISTS,BAD_REQUEST} = require('../utils/statusCode')


const regionnew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await regionData(req,transaction)
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage))
        }
        else{
            await transaction.commit();
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},messages.Success,'Regions created successfully'))
        }
    }
    catch(err){
        console.log('error in giving region',err)
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while creating regions'))

    }
}

const regionnewdata = async (req,res) =>{
    try{
        const result = await allregion(req)
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage))
        }
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},messages.Success,'Regions fetched successfully'))
    }
    catch(err){
        console.log('error in fetching region',err)
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while fetching regions'))
    }
}

const regiondatabyId = async (req,res) => {
    try{
        const result = await regionById(req)
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage))
        }
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},messages.Success,'Regions fetched successfully'))
    }
    catch(err){
        console.log('error in fetching region',err)
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,err.displayMessage||'An error occurred while fetching regions'))
    }
}

const regionDataByPk = async (req,res) => {
    try{
        const result = await regionByPk(req)
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage))
        }
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},messages.Success,'Regions fetched successfully'))
    }
    catch(err){
        console.log('error in fetching region',err)
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while fetching regions'))
    }
}
module.exports = {regionnew,regionnewdata,regiondatabyId,regionDataByPk}
