const villageModel = require('../models/village');
// const region = require('../models/region');
// const district = require('../models/district');
// const ward = require('../models/ward');
const customException = require('../errorHandler/customException');
const { NOT_FOUND } = require('../utils/statusCode');
const villageSchema = require('../joidata/villageSchema');

const Datavillage = async (req,t)=>{
    try{
        // const {region,district,ward,village,minCurrent,maxCurrent,minLast,maxLast, crop, variety} = req.body;
        const validatedData = await villageSchema.validateAsync(req.body);

        const regionId = req.params.id;
        const districtId = req.params.districtId;
        const wardId = req.params.wardId;

        const newvillage = await villageModel.create(
            {
                region:validatedData.region,
                district:validatedData.district,
                ward:validatedData.ward,
                village:validatedData.village,
                minCurrent:validatedData.minCurrent,
                maxCurrent:validatedData.maxCurrent,
                minLast:validatedData.minLast,
                maxLast:validatedData.maxLast,
                crop:validatedData.crop,
                variety:validatedData.variety,
                regionId:regionId,
                districtId:districtId,
                wardId:wardId
            },{transaction:t}
        );
        console.log('Village created',newvillage);
        return {data:newvillage};
    }
    catch(err){
        console.log('error in giving village',err);
        return {err:err};
    }
};

const villageByPk = async (req) => {
    const villageId = req.params.id;
    try {
        const villages = await villageModel.findByPk(villageId);

        if (!villages || villages.length === 0) {
            throw customException.error(NOT_FOUND, 'Enter a valid data', 'Data not found');
        }

        return { err: null, data: villages }; 
    } catch (err) {
        console.log('Error in fetching villages', err);
        return { err: err };
    }
};



// const villageDatafiltered = async ()=>{
//     try{
//         const villages = await villageModel.findAll({
//             attributes:['region','district','ward','village',
//                 literal('"Min(Current)" as "minCurrent"'),
//                 literal('"Max(Current)" as "maxCurrent"'),
//                 literal('"Min(Last)" as "minLast"'),
//                 literal('"Max(Last)" as "maxLast"'),
//                 'crop','variety'],
//             include: [
//                 {
//                     model:ward,
//                     as:'Ward',
//                     attributes:['ward'],
//                     includes:[
//                         {
//                             model: district,
//                             as:'District',
//                             attributes:['district'],
//                             includes:[
//                                 {
//                                     model: region,
//                                     as:'Region',
//                                     attributes:['region']
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ],raw:true
//         });
//         if(!villages||villages.length === 0){
//             throw customException.error(NOT_FOUND,'Enter a valid data','Data not found');
//         }
//         const formattedVillages = villages.map(village=>({
//             region:village.region,
//             district:village.district,
//             ward:village.ward,
//             village:village.village,
//             minCurrent:village.minCurrent,
//             maxCurrent:village.maxCurrent,
//             minLast:village.minLast,
//             maxLast:village.maxLast,
//             crop:village.crop,
//             variety:village.variety
//         }));
//         return {data:formattedVillages};
//     }
//     catch(err){
//         console.log('error in fetching ward',err);
//         return {err:err};
//     }
// };

const updateVillage = async (req,t) => {
    try{
        const villageName = req.body.village;
        const villageId = req.params.id;

        const [updatedvillages] = await villageModel.update(
            { village: villageName },
            { where: { village_id: villageId }, transaction: t }
        );
        if(!updatedvillages||updatedvillages.error){
            throw customException.error(NOT_FOUND,'please provide a valid village_id','Data Not Found');
        }
        return {data:{updatedvillages}};
    }
    catch(error){
        console.log('error in updating data');
        return {err:error};
    }
};

const deletevillage = async (req,t) =>{
    try{
        const villageId = req.params.id;

        const deletedvillages = await villageModel.destroy(
            {
                where: {village_id:villageId},transaction:t
            }
        );
        if(!deletedvillages||deletedvillages.error){
            throw customException.error(NOT_FOUND,'Please provide a valid village_id','Data Not Found');
        }
        return {data:{deletedvillages}};

    }
    catch(error){
        console.log('error in deleting data');
        return {err:error};
    }
};

const allvillages = async (req) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;  
        const pageSize = parseInt(req.query.pageSize) || 10;     
        const orderBy = req.query.orderBy || 'village_id';        
        const sortBy = req.query.sortBy || 'ASC';                

        const offset = (pageNumber - 1) * pageSize;
        const limit = pageSize;

        const { count, rows } = await villageModel.findAndCountAll({
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
                villages: rows,  
                totalItems: count,
                totalPages: totalPages,
                currentPage: pageNumber
            }
        };
    }
    catch (err) {
        console.log('Error in fetching villages:', err.message);
        return {err:err}; 
    }
};



module.exports = {Datavillage,villageByPk,updateVillage,deletevillage,allvillages};