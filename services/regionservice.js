const customException = require('../errorHandler/customException');
const regionModel = require('../models/region');
const regionSchema = require('../joidata/regionSchema');
const { NOT_FOUND} = require('../utils/statusCode');

const regionData = async (req, t) => {
    try {
        const validatedData = await regionSchema.validateAsync(req.body);
                
        const newRegion = await regionModel.create(
            { region: validatedData.region }, 
            { transaction: t }
        );

        console.log('Region created:', newRegion);
        return { data: newRegion };
    }
    catch (err) {
        console.log('region data not successfully created:',err);
        return {err:err};
    }
};


const allregion = async ()=>{
    try{
        const regions = await regionModel.findAll({
            attributes:['region_id','region']
        });
        if(!regions||regions.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data Not Found');
        }
        const newdata = JSON.stringify(regions);
        const newstring = JSON.parse(newdata);
        console.log('====>\n',newstring);
        return {data:newstring};

    }
    catch(err){
        console.log('error in fetching region',err);
        return {err:err};
    }
};

const regionByPk = async (req) => {
    try{
        const Id = req.params.id;
        const regionID = await regionModel.findByPk(Id);
        if(!regionID||regionID.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data Not Found');
        }
        const newdata = JSON.stringify(regionID);
        const newstring = JSON.parse(newdata);
        console.log('====>\n',newstring);
        return {data:newstring};

    }
    catch(err){
        console.log('error in fetching region',err);
        return {err:err};
    }
};

const regionById = async (req) => {
    try{
        const Id = req.params.id;
        const regionID = await regionModel.findOne({
            where:{
                region_id:Id
            }
        });
        if(!regionID||regionID.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data Not Found');
        }
        const newdata = JSON.stringify(regionID);
        const newstring = JSON.parse(newdata);
        console.log('====>\n',newstring);
        return {data:newstring};
    }
    catch(err){
        console.log('error in fetching region',err);
        return {err:err};
    }
};

module.exports = {regionData,allregion,regionById,regionByPk};
