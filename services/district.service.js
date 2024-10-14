const customException = require('../errorHandler/customException');
const District = require('../models/district.model');
const districtSchema = require('../joidata/district.schema');
const { NOT_FOUND, DATA_ALREADY_EXISTS,SUCCESS_CODE } = require('../utils/statusCode');
const {Op} = require('sequelize');
const Region = require('../models/region.model');

 module.exports = {
    // service to create Ward data if not present in database
    districtData: async function(req, t) {
        try {
            const validatedData = await districtSchema.validateAsync(req);
            const foundRegion = await Region.findOne({
                where: { region: validatedData.region }
            });
            if (!foundRegion) throw customException.error(NOT_FOUND, 'Region not found', 'The specified region does not exist in the database.');
            // checks if data is already present in database and if not it will create one
            const [newDistrict, created] = await District.findOrCreate({
                where: {                
                    district: validatedData.district,
                    regionId: foundRegion.region_id,  
                },
                defaults: {
                    district: validatedData.district,
                    regionId: foundRegion.region_id,  
                },
                transaction: t  
            });
             //returns data using ternary operator
            return created 
            ? {
                httpStatusCode: SUCCESS_CODE,
                data: newDistrict, 
                message: 'Success',
                displayMessage: 'District Successfully Created' }
            : {   
                httpStatusCode: DATA_ALREADY_EXISTS,
                data: newDistrict, 
                message: 'please provide a different District',
                displayMessage: 'District already exists' 
            }
        } 
        catch (err) { 
            console.log('Error in creating district data:', err);
            return { err: err };
        }
    },
    //fetching data with primary Key
    districtByPk: async function(Id) {
        try{
            const district = await District.findByPk(Id);//gets data with primary key
            if(!district||district?.length) throw customException.error(NOT_FOUND,'Enter a valid data','Data not found');//checks if district is null or undefined
            return {data:district}; 
        }
        catch(err){ 
            console.log('error in fetching district',err);
            return {err:err};
        }
    },
    // updating district with districtId
    updateDistricts: async function(districtId,districtName,t)  {
        try{
            //updates ward data with wardId and returns affetced rows in array format            
            const updatedDistricts = await District.update( 
                { district: districtName },
                {where: {district_id : districtId},transaction:t}
            );
            if(updatedDistricts?.[0]===0) throw customException.error(NOT_FOUND,'Please provide a valid district_id','Data not found');//checks if updatedwards is 0
            return {data:{updatedDistricts}};
        }
        catch(error){
            console.log('error in updating data');
            return {err:error};
        }
    },
    //deleting district with districtId
    deleteDistrict : async function(districtId,t) {
        try{
            const deletedDistricts = await District.destroy( //deletes district data
                {
                    where: {district_id:districtId},transaction:t
                }
            );
            if(!deletedDistricts||deletedDistricts?.length) throw customException.error(NOT_FOUND,'Please provide a valid district_id','Data Not Found');// checks if deletedRows are null 
            return {data:{deletedDistricts}};
        }
        catch(error){ 
            console.log('error in deleting data');
            return {err:error};
        }
    },
    //fetching all data along with pagination
    alldistricts : async function (req) {
        //function for searchstr to search with whereClause along with like operators
            const createWhereClause = (searchTerm) => {
                return {
                    district: { 
                        [Op.iLike]: `%${searchTerm}%`
                    }
                }
            }
            try {
                //defining all terms for pagination
                let search = req.query.search || '';
                let searchstr = search.trim();
                const pageNumber = parseInt(req.query.pageNumber) || 1;  
                const pageSize = parseInt(req.query.pageSize) || 10;     
                const orderBy = req.query.orderBy || 'district';        
                const sortBy = req.query.sortBy || 'ASC';                
                const offset = (pageNumber - 1) * pageSize;
            //checking searchstr if it contains string or null or any integer string
            let whereClause = searchstr && searchstr.toLowerCase() !== 'null' ? createWhereClause(searchstr.replace(/\d+/g, '').trim()||searchstr):{};
            let { count, rows } = await District.findAndCountAll({
                    where: whereClause,
                    order: [[orderBy, sortBy]],  
                    limit:pageSize,                       
                    offset,                      
            });
            //if count is null or '0' then throw an exception    
            if (!count&&count?.length) throw customException.error(NOT_FOUND, "Data not found", "There is no data in the district table.");
            //if pageNumber is greater than totalPages then throw an exception    
            const totalPages = Math.ceil(count / pageSize);
            if (pageNumber > totalPages) throw customException.error(NOT_FOUND, "Page not found", "The requested page does not exist.");
            return { 
                    data: {
                        districts: rows,  
                        totalItems: count,
                        totalPages: totalPages,
                        currentPage: pageNumber
                    }
                };
            } 
            catch (err) { 
                console.error('Error in fetching Districts:', err.message);
                return { err: err }; 
            }
        }
}