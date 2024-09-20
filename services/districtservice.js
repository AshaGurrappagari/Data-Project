
const constants = require('../commons/constants');
const customException = require('../errorHandler/customException');
const district = require('../models/district');
const { BAD_REQUEST, NOT_FOUND } = require('../utils/statusCode');

const letters = constants.regExp;
const districtData = async (req,t)=>{
    try{
        const regionId = req.params.id;
        const districtData = req.body.district;
        if(!districtData.match(letters)){
            throw customException.error(BAD_REQUEST,'Data not created','Use Only Alphabets');
        }
        const newdistrict = await district.create(
            {
                district:districtData,
                regionId :regionId
            },{transaction:t});
        console.log('District created',newdistrict);
        return {data:newdistrict};
    }
    catch(err){
        console.log('district data not successfully created:',err);
        return {err:err};
    }
};

const districtByPk = async (req) => {
    try{
        const Id = req.params.id;
        const districtId = await district.findByPk(Id);
        if(!districtId||districtId.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data not found');
        }
        else{
            const newdata = JSON.stringify(districtId);
            const newstring = JSON.parse(newdata);
            console.log('====>\n',newstring);
            return {data:newstring};
        }
    }
    catch(err){
        console.log('error in fetching district',err);
        return {err:err};
    }
};

const districtById = async (req) => {
    try{
        const Id = req.params.id;
        const districtId = await district.findOne({
            where:{
                district_id:Id
            }
        });
        if(!districtId||districtId.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data not found');
        }
        else{
            const newdata = JSON.stringify(districtId);
            const newstring = JSON.parse(newdata);
            console.log('====>\n',newstring);
            return {data:newstring};
        }
    }
    catch(err){
        console.log('error in fetching district',err);
        return {err:err};
    }
};

module.exports = {districtData,districtByPk,districtById};
