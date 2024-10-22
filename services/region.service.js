const customException = require('../errorHandler/customException');
const { NOT_FOUND,DATA_ALREADY_EXISTS, SUCCESS_CODE, BAD_REQUEST} = require('../utils/statusCode');
const {Op} = require('sequelize')
const regionModel = require('../models/region.model');

module.exports = {
    // service to create region data if not present in database
    regionData : async function(req, t) {
    try {
        //find or create change
        console.log('Incoming request body:', req.body);
        // console.log('Validated data:', req);

        const { region } = req.body; 
        const created = await regionModel.findOne({where:{region}})
        if(created) return {data:created, httpStatusCode: DATA_ALREADY_EXISTS,message: 'Please provide a different region name',displayMessage: 'Region data already Created'}

        const newRegion = await regionModel.create({region:region},t)
        if(!newRegion) throw customException.error(BAD_REQUEST,'Error while creating Region Data','Region data not Succefully created'); 
        return {data:newRegion,message:'Created Successfully', displayMessage:'Region Created Successfully'}
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
