const regExp = require('../commons/constants');
const sequelize = require('../config/database');
const customException = require('../errorHandler/customException');
const ward = require('../models/ward');
const { messages } = require('../utils/errmessage');
const { BAD_REQUEST, NOT_FOUND } = require('../utils/statusCode');

const letters = regExp;
const wardData = async (req,t) => {
    try{
        const wardData = req.body.ward;
        const districtId = req.params.id
        if(!wardData.match(letters)){
            throw customException.error(BAD_REQUEST,messages.notCreated,'Use Only Alphabets')
        }
        const newward = await ward.create({
            ward:wardData,
            districtId :districtId
        },{transaction:t}
        )
        console.log('ward creeated',newward)
        return {data:newward}
    }
    catch(err){
        console.log('error in giving ward',err)
        return {err:err}
    }
}
const wardByPk = async (req) => {
    try{
        const Id = req.params.id
        const wardId = await ward.findByPk(Id)
        if(!wardId||wardId.length === 0){
            throw customException.error(NOT_FOUND,messages.invalidData,'Data Not Found')
        }
        const newdata = JSON.stringify(wardId)
        const newstring = JSON.parse(newdata)
        console.log('====>\n',newstring)
        return {data:newstring}
    }
    catch(err){
        console.log('error in fetching ward',err)
        return {err:err}
    }
}
const wardById = async (req) => {
    try{
        const Id = req.params.id
        const wardId = await ward.findOne({
            where:{
                ward_id:Id
            }
        })
        if(!wardId||wardId.length === 0){
            throw customException.error(NOT_FOUND,messages.invalidData,'Data not found')
        }
        const newdata = JSON.stringify(wardId)
        const newstring = JSON.parse(newdata)
        console.log('====>\n',newstring)
        return {data:newstring}
    }
    catch(err){
        console.log('error in fetching ward',err)
        return {err:err}
    }
}

module.exports = {wardData,wardByPk,wardById}

