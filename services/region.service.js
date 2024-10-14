const customException = require('../errorHandler/customException');
const { NOT_FOUND,DATA_ALREADY_EXISTS, SUCCESS_CODE} = require('../utils/statusCode');
const {Op} = require('sequelize')
const regionModel = require('../models/region.model');
const regionSchema = require('../joidata/region.schema');

module.exports = {
    // service to create region data if not present in database
    regionData : async function(req, t) {
    try {
        const validatedData = await regionSchema.validateAsync(req);
        // checks if data is already present in database and if not it will create one
        const [region, created] = await regionModel.findOrCreate({
            where: { region: validatedData.region },
            defaults: {
                region: validatedData.region
            },
            transaction: t 
        });
        //returns data using ternary operator
        return created 
            ?   {
                    httpStatusCode: SUCCESS_CODE,
                    data: region, 
                    message: 'Success',
                    displayMessage: 'Region Successfully Created' }
                : {   
                    httpStatusCode: DATA_ALREADY_EXISTS,
                    data: region, 
                    message: 'please provide a different region',
                    displayMessage: 'Region already exists' 
                }
    }
    catch (err) { 
        console.log('Region data not successfully created:', err);
        return { err: err };
    }
},
//fetching data with primary Key
regionByPk : async function (Id){
    try{
        const region = await regionModel.findByPk(Id);
        if(!region||region?.length) throw customException.error(NOT_FOUND,'Enter a valid data','Data Not Found');
        return {data:region}; 
    }
    catch(err){ 
        console.log('error in fetching region',err);
        return {err:err};
    }
},
//service to update region data
updateRegion : async function (regionId,regionName,t) {
    try{
        const updatedRegions = await regionModel.update( 
            { region: regionName },
            {where: {region_id : regionId},transaction:t}
        );
        if(updatedRegions?.[0] === 0) throw customException.error(NOT_FOUND,'Please provide a valid region_id','Data not found'); 
        return {data:updatedRegions}; 
    }
    catch(error){ 
        console.log('error in updating data');
        return {err:error};
    }
},
//service to delete region data
deleteRegion : async function(req,t) {
    try{
        const regionId = req.params.id;
            const deletedRegions = await regionModel.destroy( 
            {
                where: {region_id:regionId},transaction:t
            }
        );
        if(!deletedRegions&&!deletedRegions?.length) throw customException.error(NOT_FOUND,'Please provide a valid region_id','Data Not Found'); 
        return {data:{deletedRegions}};
    }
    catch(error){ 
        console.log('error in deleting data');
        return {err:error};
    }
},
//fetching all data along with pagination
allregion : async function(req)  {
    //function for searchstr to search with whereClause along with like operators
    const createWhereClause=(searchterm)=>{
        return {
            region: { 
                [Op.iLike]: `%${searchterm}%`
            }
        }
    }
    try {
        let search = req.query.search || '';
        let searchstr = search.trim();
        const pageNumber = parseInt(req.query.pageNumber) || 1;  
        const pageSize = parseInt(req.query.pageSize) || 10;     
        const orderBy = req.query.orderBy || 'region';        
        const sortBy = req.query.sortBy || 'ASC';                
        const offset = (pageNumber - 1) * pageSize;
        //checking searchstr if it contains string or null or any integer string
        let whereClause = searchstr && searchstr.toLowerCase() !== 'null' ? createWhereClause(searchstr.replace(/\d+/g, '').trim()||searchstr) : {};

        let { count, rows } = await regionModel.findAndCountAll({
            where: whereClause,
            order: [[orderBy, sortBy]],  
            limit:pageSize,                       
            offset,                      
        });
        if (!count && count?.length) throw customException.error(NOT_FOUND, "Data not found", "There is no data in the region table.");
        const totalPages = Math.ceil(count / pageSize);
        if (pageNumber > totalPages && !totalPages?.length) throw customException.error(NOT_FOUND, "Page not found", "The requested page does not exist.");
        return { 
            data: {
                regions: rows,  
                totalItems: count,
                totalPages: totalPages,
                currentPage: pageNumber
            }
        };
    } catch (err) { 
        console.error('Error in fetching Regions:', err.message);
        return { err: err }; 
    }
}
}
