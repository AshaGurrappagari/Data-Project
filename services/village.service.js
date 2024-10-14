const customException = require('../errorHandler/customException');
const District = require('../models/district.model');
const { NOT_FOUND, BAD_REQUEST, DATA_ALREADY_EXISTS, SUCCESS_CODE } = require('../utils/statusCode');
const {Op} = require('sequelize');
const Region = require('../models/region.model');
const sequelize = require('../config/database');
const villageModel = require('../models/village.model');
const villageSchema = require('../joidata/village.schema');
const Ward = require('../models/ward.model');

module.exports = {
    Datavillage : async function (req, t){
        try {
            const validatedData = await villageSchema.validateAsync(req);
            // checking if provided region, district, ward are present in database or not
            const [foundRegion, foundDistrict, foundWard] = await Promise.all([
                Region.findOne({ where: { region: validatedData.region } }),
                District.findOne({ where: { district: validatedData.district } }),
                Ward.findOne({ where: { ward: validatedData.ward } })
            ]);
            if (!foundRegion) throw customException.error(NOT_FOUND, 'Region not found', 'Region not found');
            else if (!foundDistrict) throw customException.error(NOT_FOUND, 'District not found', 'District not found');
            else if (!foundWard) throw customException.error(NOT_FOUND, 'Ward not found', 'Ward not found');
    
            // checks if data is already present with same id's in database and if not it will create one
            const [newVillage, created] = await villageModel.findOrCreate({
                where: {
                    regionId: foundRegion.region_id,  
                    districtId: foundDistrict.district_id,
                    wardId: foundWard.ward_id,
                    village: validatedData.village
                },
                defaults: {
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
                },
                transaction: t  
            });
             //returns data using ternary operator
            return created
                ? { 
                    httpStatusCode: SUCCESS_CODE,
                    data: newVillage ,
                    message: 'Success',
                    displayMessage: 'Village Created Successfully'
                }  
                : {
                    httpStatusCode: DATA_ALREADY_EXISTS,
                    data: newVillage,
                    message: 'Please provide a different village',
                    displayMessage: 'Village already exists'
                };
            } 
        catch (err) {  
            console.error('Error in creating village:', err);
            return { err: err };  
        }
    },
    //fetching with primary Key
    villageByPk: async function (villageId) {
        try {
            const village = await villageModel.findByPk(villageId); 
            if(!village&&!village?.length) throw customException.error(NOT_FOUND,'No Data Found', 'Villages are not found')
            return { data: village };
        } catch (err) {  
            console.error('Error in fetching village:', err);
            return { err: err };
        }
    },
    //Updating village Data
    updateVillage : async function(villageName,villageId, t) {
        try {
            const updatedRows = await villageModel.update( 
                { village: villageName },
                { where: { village_id: villageId }, transaction: t }
            );
            if (updatedRows?.[0]===0) throw customException.error(NOT_FOUND, 'Please provide a valid village_id', 'Data Not Found');
            return { data: updatedRows  };
        } 
        catch (error) {  
            console.error('Error in updating village:', error);
            return { err: error };
        }
    },
    //Deleting village Data
    deletevillage : async function (villageId, t) {
        try {
            const deletedRows = await villageModel.destroy({ 
                where: { village_id: villageId },
                transaction: t
            });
            if (!deletedRows&&!deletedRows?.length) throw customException.error(NOT_FOUND, 'Please provide a valid village_id', 'Data Not Found');
            return { data:  deletedRows  };
        } 
        catch (error) {  
            console.error('Error in deleting village:', error);
            return { err: error };
        }
    },
    //fetching all data along with pagination
    allvillages : async function (req) {    
        //function for searchstr to search with whereClause along with like operators
        const createWhereClause = (searchTerm) => {
            return {
                [Op.or]: [
                    { village: { [Op.iLike]: `%${searchTerm}%` } },
                    { regionName: { [Op.iLike]: `%${searchTerm}%` } },
                    { districtName: { [Op.iLike]: `%${searchTerm}%` } },
                    { wardName: { [Op.iLike]: `%${searchTerm}%` } },
                    { crop: { [Op.iLike]: `%${searchTerm}%` } },
                    { variety: { [Op.iLike]: `%${searchTerm}%` } },
                ]
            };
        };
        try {
            //defining all terms for pagination
            let search = req.query.search || ''; 
            let searchstr = search.trim();
            const pageNumber = parseInt(req.query.pageNumber) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const orderBy = req.query.orderBy || 'village';
            const sortBy = req.query.sortBy || 'ASC';
            const offset = (pageNumber - 1) * pageSize;
    
            //checking searchstr if it contains string or null or any integer string
            let whereClause = searchstr && searchstr.toLowerCase() !== 'null' ? createWhereClause(searchstr.replace(/\d+/g, '').trim()||searchstr) : {};
    
            let { count, rows } = await villageModel.findAndCountAll({
                attributes: ['village', 'regionName', 'districtName', 'wardName', 'crop', 'variety'],
                where: whereClause,
                order: [[orderBy, sortBy]],
                limit: pageSize,
                offset,
            });
            if (!count && count?.length) throw customException.error(NOT_FOUND, "Data not found", "There is no data in the village table.");    
            const totalPages = Math.ceil(count / pageSize);
            if (pageNumber > totalPages && !totalPages?.length) throw customException.error(NOT_FOUND, "Page not found", "The requested page does not exist.");
            return {
                data: {
                    villages: rows,
                    totalItems: count,
                    totalPages: totalPages,
                    currentPage: pageNumber,
                }
            };
        } 
        catch (err) {  
            console.error('Error in fetching villages:', err.message);
            return { err: err };
        }
    },
//fetching village,ward,region for each villageName
fetchVillageName : async function() {
        try {
            const dataOfVillages = await villageModel.findAll({
                attributes: ['village'], //get village,ward, region through joins
                include:[{
                    model: Region,
                    attributes:['region'],
                    as: 'Region',
                },
                {
                    model: Ward,
                    attributes:['ward'],
                    as: 'Ward',
                }],
                group:['village','Region.region','Region.region_id','Ward.ward','Ward.ward_id'],
    
            }); 
            if (!dataOfVillages?.length) throw customException.error(BAD_REQUEST, 'Data Not Found', 'Village Data Does not exist');
            return { data: { dataOfVillages } };
        } 
        catch (err) {  
            console.log('Error in fetching villages:', err.message);
            return { err: err };
        }
    },
    //count the no. of villages in each ward
    villagesbyward : async function(){
        try{
            const villages = await villageModel.findAll({
                attributes:[[sequelize.fn('COUNT', sequelize.col('village')),'villageCount'],'wardName'], 
                group : ['wardName']
            })
            if(!villages?.length) throw customException.error(NOT_FOUND,'No Data Found', 'Villages are not found')
            return {data:{villages}} 
        }
        catch(err){  
            console.log('Error in fetching villages:', err.message);
            return {err:err}
        }
    },
    //fetch region names where village is present
    fetchRegion : async function(){
        try{
            const villages = await villageModel.findAll({
                attributes:[[sequelize.fn('DISTINCT',sequelize.col('regionName')),'regionName']] 
            })
            if(!villages?.length) throw customException.error(NOT_FOUND,'No Data Found', 'Regions are not found')
            return {data:{villages}}
        }
        catch(err){  
            console.log('Error in fetching villages:', err.message);
            return {err:err}
        }
    },
    //fetch ward names that have morethan 1 village.
    fetchWards : async function ()  {
        try{
            const wards = await villageModel.findAll({
                attributes:[[sequelize.fn('DISTINCT',sequelize.col('wardName')),'wardName'], 
                [sequelize.fn('COUNT',sequelize.col('village')),'villageCount']], 
                group: ['wardName'], 
                having: sequelize.literal('COUNT(village)>1') 
            })
            if(!wards?.length) throw customException.error(NOT_FOUND,'No Data Found','Wards are not found') 
            return {data:{wards}}
        }
        catch(err){  
            console.log('Error in fetching villages:', err.message);
            return {err:err}
        }
    }
}



// data validation - done
//search bar - done
//secure way of checking chaining data - done
//sequelize raw queries -done

//debugger
//null validation - done
//all validations regarding allvillages -done

//fetch village,ward,region for each villageName - done
//count the no. of villages in each ward - done
//fetch region names where village is present - done
//fetch ward names that have morethan 1 village. - done
//optimisation - somewhat done 

//includes - done
//storedprocedures

//optional chaining
//ER
//how to design my api

