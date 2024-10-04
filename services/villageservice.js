const villageModel = require('../models/village');
const regionModel = require('../models/region');      
const districtModel = require('../models/district');  
const wardModel = require('../models/ward');          
const customException = require('../errorHandler/customException');
const { NOT_FOUND, BAD_REQUEST } = require('../utils/statusCode');
const villageSchema = require('../joidata/villageSchema');
const Sequelize = require('sequelize')
const {Op} = require('sequelize');
const sequelize = require('../config/database');
const Region = require('../models/region');
const Ward = require('../models/ward');

const Datavillage = async (req, t) => {
    try {
        const validatedData = await villageSchema.validateAsync(req.body);

        const foundRegion = await regionModel.findOne({ where: { region: validatedData.region } });
        const foundDistrict = await districtModel.findOne({ where: { district: validatedData.district } });
        const foundWard = await wardModel.findOne({ where: { ward: validatedData.ward } });

        if (!foundRegion) console.log('Region not found');
        if (!foundDistrict) console.log('District not found');
        if (!foundWard) console.log('Ward not found');

        if (!foundRegion || !foundDistrict || !foundWard) {
            throw customException.error(NOT_FOUND, 'Region, District, or Ward not found', 'Data not found');
        }

        const newVillage = await villageModel.create({
            regionId: foundRegion.region_id,  
            districtId: foundDistrict.district_id,
            wardId: foundWard.ward_id,
            regionName: validatedData.region,    
            districtName: validatedData.district,
            wardName: validatedData.ward,
            village: validatedData.village,
            minCurrent: validatedData.minCurrent,
            maxCurrent: validatedData.maxCurrent,
            minLast: validatedData.minLast,
            maxLast: validatedData.maxLast,
            crop: validatedData.crop,
            variety: validatedData.variety
        }, { transaction: t });

        console.log('Village created:', newVillage);
        return { data: newVillage };
    } catch (err) {
        console.error('Error in creating village:', err);
        return { err: err };
    }
};

const villageByPk = async (req) => {
    const villageId = req.params.id;
    try {
        const village = await villageModel.findByPk(villageId);

        if (village?.length) {
            throw customException.error(NOT_FOUND, 'Enter a valid village ID', 'Data not found');
        }

        return { data: village };
    } catch (err) {
        console.error('Error in fetching village:', err);
        return { err: err };
    }
};

const updateVillage = async (req, t) => {
    try {
        const villageName = req.body.village;
        const villageId = req.params.id;

        const foundVillage = await villageModel.findByPk(villageId);
        if (!foundVillage) {
            throw customException.error(NOT_FOUND, 'Please provide a valid village_id', 'Data Not Found');
        }

        const [updatedRows] = await villageModel.update(
            { village: villageName },
            { where: { village_id: villageId }, transaction: t }
        );

        if (updatedRows?.length) {
            throw customException.error(NOT_FOUND, 'Please provide a valid village_id', 'Data Not Found');
        }

        return { data: { updatedRows } };
    } catch (error) {
        console.error('Error in updating village:', error);
        return { err: error };
    }
};

const deletevillage = async (req, t) => {
    try {
        const villageId = req.params.id;

        const foundVillage = await villageModel.findByPk(villageId);
        if (!foundVillage) {
            throw customException.error(NOT_FOUND, 'Please provide a valid village_id', 'Data Not Found');
        }

        const deletedRows = await villageModel.destroy({
            where: { village_id: villageId },
            transaction: t
        });

        if (deletedRows?.length) {
            throw customException.error(NOT_FOUND, 'Please provide a valid village_id', 'Data Not Found');
        }

        return { data: { deletedRows } };
    } catch (error) {
        console.error('Error in deleting village:', error);
        return { err: error };
    }
};

// const allvillages = async (req) => {
//     try {
//         let search = req.query.search || '';
//         search = search.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');

//         const pageNumber = parseInt(req.query.pageNumber) || 1;
//         const pageSize = parseInt(req.query.pageSize) || 10;
//         const orderBy = req.query.orderBy || 'village';
//         const sortBy = req.query.sortBy || 'ASC';

//         const offset = (pageNumber - 1) * pageSize;
//         const limit = pageSize;

//         const whereClause = search && search.toLowerCase() !== 'null' ? {
//             [Op.or]: [


//                 { village: { [Op.iLike]: `%${seaarch}%` } },
//                 { regionName: { [Op.iLike]: `%${search}%` } },
//                 { districtName: { [Op.iLike]: `%${search}%` } },
//                 { wardName: { [Op.iLike]: `%${search}%` } }
//             ]
//         } : {};

//         let { count, rows } = await villageModel.findAndCountAll({
//             where: whereClause,
//             order: [[orderBy, sortBy]],
//             limit,
//             offset,

//         });
//         if (count === 0) {
//             search = search.replace(/\d+/g, '').trim();
//             const whereClauseWithoutNumbers = search && search.toLowerCase() !== 'null' ? {
//                 [Op.or]: [
//                     { village: { [Op.iLike]: `%${search}%` } },
//                     { regionName: { [Op.iLike]: `%${search}%` } },
//                     { districtName: { [Op.iLike]: `%${search}%` } },
//                     { wardName: { [Op.iLike]: `%${search}%` } }
//                 ]
//             } :{};

//             ({ count, rows } = await villageModel.findAndCountAll({
//                 where: whereClauseWithoutNumbers,
//                 order: [[orderBy, sortBy]],
//                 limit,
//                 offset
//             }));
//         }

//         if (count === 0) {
//             throw customException.error(NOT_FOUND, "Data not found", "There is no data in the village table.");
//         }
//         const totalPages = Math.ceil(count / pageSize);

//         if (pageNumber > totalPages && totalPages !== 0) {
//             throw customException.error(NOT_FOUND, "Page not found", "The requested page does not exist.");
//         }

//         return {
//             data: {
//                 villages: rows,
//                 totalItems: count,
//                 totalPages: totalPages,
//                 currentPage: pageNumber
//             }
//         };
//     } catch (err) {
//         console.error('Error in fetching villages:', err.message);
//         return { err: err };
//     }
// };

const allvillages = async (req) => {
    try {
        let search = req.query.search || ''; 
        let searchstr = search.trim();

        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const orderBy = req.query.orderBy || 'village';
        const sortBy = req.query.sortBy || 'ASC';

        const offset = (pageNumber - 1) * pageSize;
        const limit = pageSize;

        let whereClause = {};
        if (searchstr && searchstr.toLowerCase() !== 'null') {
            whereClause = {
                [Op.or]: [
                    { village: { [Op.iLike]: `%${searchstr}%` } },
                    { regionName: { [Op.iLike]: `%${searchstr}%` } },
                    { districtName: { [Op.iLike]: `%${searchstr}%` } },
                    { wardName: { [Op.iLike]: `%${searchstr}%` } },
                    { crop: { [Op.iLike]: `%${searchstr}%` } },
                    { variety: { [Op.iLike]: `%${searchstr}%` } },
                ]
            };
        }

        let { count, rows } = await villageModel.findAndCountAll({
            attributes:['village','regionName','districtName','wardName','crop','variety'],
            where: whereClause,
            order: [[orderBy, sortBy]],
            limit,
            offset,
        });

        if (count === 0 && searchstr) {
            let searchWithoutNumbers = searchstr.replace(/\d+/g, '').trim();
            
            if (searchWithoutNumbers) {
                const whereClauseWithoutNumbers = {
                    [Op.or]: [
                        { village: { [Op.iLike]: `%${searchWithoutNumbers}%` } },
                        { regionName: { [Op.iLike]: `%${searchWithoutNumbers}%` } },
                        { districtName: { [Op.iLike]: `%${searchWithoutNumbers}%` } },
                        { wardName: { [Op.iLike]: `%${searchWithoutNumbers}%` } },
                        { crop: { [Op.iLike]: `%${searchstr}%` } },
                        { variety: { [Op.iLike]: `%${searchstr}%` } },
                        ]
                };

                ({ count, rows } = await villageModel.findAndCountAll({
                    attributes:['village','regionName','districtName','wardName','crop','variety'],
                    where: whereClauseWithoutNumbers,
                    order: [[orderBy, sortBy]],
                    limit,
                    offset,
                }));
            }

            if (count === 0) {
                throw customException.error(NOT_FOUND, "Data not found", "Provided numeric data does not match any entries.");
            }
        }

        if (count === 0) {
            throw customException.error(NOT_FOUND, "Data not found", "There is no data in the village table.");
        }

        const totalPages = Math.ceil(count / pageSize);

        if (pageNumber > totalPages && totalPages !== 0) {
            throw customException.error(NOT_FOUND, "Page not found", "The requested page does not exist.");
        }

        return {
            data: {
                villages: rows,
                totalItems: count,
                totalPages: totalPages,
                currentPage: pageNumber,
            }
        };
    } catch (err) {
        console.error('Error in fetching villages:', err.message);
        return { err: err };
    }
};

const fetchVillageName = async () => {
    try {
        const dataOfVillages = await villageModel.findAll({
            attributes: ['village'],
            include:[{
                model: Region,
                attributes:['region'],
                as: 'Region'
            },
            {
                model: Ward,
                attributes:['ward'],
                as: 'Ward'
            }],
            group:['village','Region.region','Region.region_id','Ward.ward','Ward.ward_id'],

        }); 
        if (dataOfVillages?.length) { 
           throw customException.error(BAD_REQUEST, 'Invalid village name', 'Please provide a valid village name');
        }
        return { data: { dataOfVillages } };
    } 
    catch (err) {
        console.log('Error in fetching villages:', err.message);
        return { err: err };
    }
};

const villagesbyward = async () => {
    try{
        const villages = await villageModel.findAll({
            attributes:[[sequelize.fn('COUNT', sequelize.col('village')),'villageCount'],'wardName'],
            group : ['wardName']
        })
        if(villages?.length){
            throw customException.error(NOT_FOUND,'No Data Found', 'Villages are not found')
        }
        return {data:{villages}}
    }
    catch(err){
        console.log('Error in fetching villages:', err.message);
        return {err:err}
    }
}

const fetchRegion = async () => {
    try{
        const villages = await villageModel.findAll({
            attributes:[[sequelize.fn('DISTINCT',sequelize.col('regionName')),'regionName']]
        })
        if(villages?.length){
            throw customException.error(NOT_FOUND,'No Data Found', 'Regions are not found')
        }
        return {data:{villages}}
    }
    catch(err){
        console.log('Error in fetching villages:', err.message);
        return {err:err}    
    }
}

const fetchWards = async () => {
    try{
        const wards = await villageModel.findAll({
            attributes:[[sequelize.fn('DISTINCT',sequelize.col('wardName')),'wardName'], 
            [sequelize.fn('COUNT',sequelize.col('village')),'villageCount']],
            group: ['wardName'],
            having: sequelize.literal('COUNT(village)>1')
        })
        if(wards?.length){
            throw customException.error(NOT_FOUND,'No Data Found','Wards are not found')
        }
        return {data:{wards}}
    }
    catch(err){
        console.log('Error in fetching villages:', err.message);
        return {err:err}
    }
}

module.exports = { Datavillage, villageByPk, updateVillage, deletevillage, allvillages,fetchVillageName,villagesbyward,fetchRegion,fetchWards};



// data validation - done
//search bar - done
//secure way of checking chaining data - 
//sequelize raw queries -done

//debugger
//null validation
//all validations regarding allvillages

//fetch village,ward,region for each villageName - done
//count the no. of villages in each ward - done
//fetch region names where village is present - done
//fetch ward names that have morethan 1 village. - done

//includes
//storedprocedures

