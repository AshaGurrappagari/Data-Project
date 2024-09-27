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


// const allregion = async ()=>{
//     try{
//         const regions = await regionModel.findAll({paranoid: false});
//         if(!regions||regions.length === 0){
//             throw customException.error(NOT_FOUND,'Enter a valid data','Data Not Found');
//         }
//         return {data:regions};
//     }
//     catch(err){
//         console.log('error in fetching region',err);
//         return {err:err};
//     }
// };

const regionByPk = async (req) => {
    try{
        const Id = req.params.id;
        const region = await regionModel.findByPk(Id);
        if(!region||region.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data Not Found');
        }
        return {data:region};
    }
    catch(err){
        console.log('error in fetching region',err);
        return {err:err};
    }
};

const updateRegion = async (req,t) => {
    try{
        const regionId = req.params.id;
        const regionName = req.body.region;
        const updatedRegions = await regionModel.update(
            { region: regionName },
            {where: {region_id : regionId},transaction:t}
        );
        if(!updatedRegions||updatedRegions.error){
            throw customException.error(NOT_FOUND,'Please provide a valid region_id','Data not found');
        }
        return {data:{updatedRegions}};
    }
    catch(error){
        console.log('error in updating data');
        return {err:error};
    }
};

const deleteRegion = async (req,t) =>{
    try{
        const regionId = req.params.id;

        const deletedRegions = await regionModel.destroy(
            {
                where: {region_id:regionId},transaction:t
            }
        );
        if(!deletedRegions||deletedRegions.error){
            throw customException.error(NOT_FOUND,'Please provide a valid region_id','Data Not Found');
        }
        return {data:{deletedRegions}};

    }
    catch(error){
        console.log('error in deleting data');
        return {err:error};
    }
};

const allregion = async (req) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;  
        const pageSize = parseInt(req.query.pageSize) || 10;     
        const orderBy = req.query.orderBy || 'region_id';        
        const sortBy = req.query.sortBy || 'ASC';                

        const offset = (pageNumber - 1) * pageSize;
        const limit = pageSize;

        const { count, rows } = await regionModel.findAndCountAll({
            order: [[orderBy, sortBy]],  
            limit,                       
            offset,                      
            paranoid: false              
        });

        const totalPages = Math.ceil(count / pageSize);

        if (pageNumber > totalPages) {
            throw customException.error(NOT_FOUND,"Page not found","The requested page does not exist.");
        }

        return {
            data: {
                regions: rows,  
                totalItems: count,
                totalPages: totalPages,
                currentPage: pageNumber
            }
        };
    }
    catch (err) {
        console.log('Error in fetching Regions:', err.message);
        return {err:err}; 
    }
};

module.exports = {regionData,allregion,regionByPk,updateRegion,deleteRegion};
