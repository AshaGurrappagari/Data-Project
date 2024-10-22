const customException = require('../errorHandler/customException');
const District = require('../models/district.model');
const { NOT_FOUND, BAD_REQUEST, DATA_ALREADY_EXISTS} = require('../utils/statusCode');
const {Op} = require('sequelize');
const Region = require('../models/region.model');
const sequelize = require('../config/database');
const villageModel = require('../models/village.model');
// const villageSchema = require('../joidata/village.schema');
const Ward = require('../models/ward.model');

module.exports = {
    Datavillage : async function (req, t){
        try {
            console.log('Incoming request body:', req.body);
    
            const {region,district,ward,village,minCurrent,maxCurrent,minLast,maxLast,crop,variety} = req.body;
            const [foundRegion, foundDistrict, foundWard] = await Promise.all([
                Region.findOne({ where: { region: region } }),
                District.findOne({ where: { district: district } }),
                Ward.findOne({ where: { ward: ward } })
            ]);
            if (!foundRegion) throw customException.error(NOT_FOUND, 'Region not found', 'Region not found');
            else if (!foundDistrict) throw customException.error(NOT_FOUND, 'District not found', 'District not found');
            else if (!foundWard) throw customException.error(NOT_FOUND, 'Ward not found', 'Ward not found');
            const created = await villageModel.findOne({
                where:{
                    regionId: foundRegion.region_id,  
                    districtId: foundDistrict.district_id,
                    wardId: foundWard.ward_id,
                    village: village
                }
            })
            if(created) return {data:created, httpStatusCode: DATA_ALREADY_EXISTS,message: 'Please provide a different village name',displayMessage: 'Village data already Created'}

            const newVillage = await villageModel.create({
                regionId: foundRegion.region_id,  
                districtId: foundDistrict.district_id,
                wardId: foundWard.ward_id,
                regionName: region,    
                districtName: district,
                wardName: ward,
                village: village,
                minCurrent: minCurrent,
                maxCurrent: maxCurrent,
                minLast: minLast,
                maxLast: maxLast,
                crop: crop,
                variety: variety
            },t)
             //returns data using ternary operator
             if(!newVillage) throw customException.error(BAD_REQUEST,'Error while creating Village Data','Village data not Succefully created'); 
             return {data:newVillage,message:'Created Successfully', displayMessage:'Village Created Successfully'}
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



//user table - fn,ln,email,password(encyrpted),createdat,updatedat,deletedat (if signup or not)
//application - app.id,userid,applicationName(or)permission- (global admin,super admin, vendor),c,u,d

// {
//     "region": "India",
//     "district": "Karnataka",
//     "ward": "Banglore",
//     "village": "Banshankari",
//     "minCurrent": 42000,
//     "maxCurrent": 42000,
//     "minLast": 42000,
//     "maxLast": 42000,
//     "crop": "new crop",
//     "variety": "new variety"
//   }