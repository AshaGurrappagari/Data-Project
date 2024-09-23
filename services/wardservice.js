const customException = require('../errorHandler/customException');
const  wardSchema  = require('../joidata/wardSchema');
const ward = require('../models/ward');
const { NOT_FOUND } = require('../utils/statusCode');

const wardData = async (req,t) => {
    try{
        const validatedData = await wardSchema.validateAsync(req.body);
        const districtId = req.params.id;

        const newward = await ward.create({
            ward:validatedData.ward,
            districtId :districtId
        },{transaction:t}
        );
        console.log('ward creeated',newward);
        return {data:newward};
    }
    catch(err){
        console.log('error in giving ward',err);
        return {err:err};
    }
};

const wardByPk = async (req) => {
    try{
        const Id = req.params.id;
        const wardId = await ward.findByPk(Id);
        if(!wardId||wardId.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data Not Found');
        }
        const newdata = JSON.stringify(wardId);
        const newstring = JSON.parse(newdata);
        console.log('====>\n',newstring);
        return {data:newstring};
    }
    catch(err){
        console.log('error in fetching ward',err);
        return {err:err};
    }
};

const wardById = async (req) => {
    try{
        const Id = req.params.id;
        const wardId = await ward.findOne({
            where:{
                ward_id:Id
            }
        });
        if(!wardId||wardId.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data not found');
        }
        const newdata = JSON.stringify(wardId);
        const newstring = JSON.parse(newdata);
        console.log('====>\n',newstring);
        return {data:newstring};
    }
    catch(err){
        console.log('error in fetching ward',err);
        return {err:err};
    }
};

module.exports = {wardData,wardByPk,wardById};

