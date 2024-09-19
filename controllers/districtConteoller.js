const sequelize = require('../config/database')
const response = require('../errorHandler/response');
const {districtData,districtById, districtByPk} = require('../services/districtservice');
const {SUCCESS_CODE,NOT_FOUND,SERVER_ERROR,DATA_ALREADY_EXISTS,BAD_REQUEST} = require('../utils/statusCode')
const { messages } = require('../utils/errmessage');
const customException = require('../errorHandler/customException');



const districtnew = async (req,res)=>{
    try{
       const transaction = await sequelize.transaction();
       const result = await districtData(req,transaction)
       if(result.err){
        await transaction.rollback();
        return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage))
    }
    else{
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},messages.Success,'districts created successfully'))
    }
    }
    catch(err){
        console.log('error in giving district',err)
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while creating districts'))

    }
}
const districtDataById = async (req,res) => {
    try{
        const result = await districtById(req)
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage))
        }
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},messages.Success,'districts fetched successfully'))
    }
    catch(err){
        console.log('error in fetching district',err)
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while fetching districts'))
    }}

const districtDataByPk = async (req,res) => {
    try{
        const result = await districtByPk(req)
        if(result.err){
            return res.status(NOT_FOUND).json(response.errorWith(NOT_FOUND,result.err.message,result.err.displayMessage))
        }
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},messages.Success,'districts fetched successfully'))
    }
    catch(err){
        console.log('error in fetching district',err)
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while fetching districts'))
    }
}
module.exports = {districtnew,districtDataById,districtDataByPk}

