
const customException = require('../errorHandler/customException');
const districtSchema = require('../joidata/districtSchema');
const district = require('../models/district');
const { NOT_FOUND } = require('../utils/statusCode');

const districtData = async (req,t)=>{
    try{
        const regionId = req.params.id;
        const validatedData = await districtSchema.validateAsync(req.body);


        const newdistrict = await district.create(
            {
                district:validatedData.district,
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
