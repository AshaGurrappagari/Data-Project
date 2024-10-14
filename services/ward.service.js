const customException = require('../errorHandler/customException');
const District = require('../models/district.model');
const { NOT_FOUND ,DATA_ALREADY_EXISTS,SUCCESS_CODE} = require('../utils/statusCode');
const {Op}  = require('sequelize');
const ward = require('../models/ward.model');

module.exports = {
        // service to create Ward data if not present in database
        wardData : async function (req,t) {
            try{
                // checks if data is already present in database and if not it will create one
                const validatedData = await wardSchema.validateAsync(req);
                const foundDistrict = await District.findOne({ where: { district: validatedData.district } });
                if (!foundDistrict) throw customException.error(NOT_FOUND, 'district not found', 'Data not found');
                const [newward, created] = await ward.findOrCreate({
                    where: {                
                        ward:validatedData.ward,
                        districtId: foundDistrict.district_id,  
                        },
                    defaults: {
                        ward:validatedData.ward,
                        districtId: foundDistrict.district_id,  
                        },
                    transaction: t  
                });
                //returns data using ternary operator
                return created 
                ? {
                    httpStatusCode: SUCCESS_CODE,
                    data: newward, 
                    message: 'Success',
                    displayMessage: 'Ward Successfully Created' }
                : {   
                    httpStatusCode: DATA_ALREADY_EXISTS,
                    data: newward, 
                    message: 'please provide a different Ward',
                    displayMessage: 'Ward already exists' 
                }
            }
            catch(err){ 
                console.log('error in giving ward',err);
                return {err:err};
            }
        },
        //fetching data with primary Key
        wardByPk : async function (Id)  {
            try{
                const wards = await ward.findByPk(Id);
                if(!wards||wards?.length) throw customException.error(NOT_FOUND,'Enter a valid data','Data Not Found');
                return {data:wards};
            }
            catch(err){
                console.log('error in fetching ward',err);
                return {err:err};
            }
        },
        // updating ward with wardID
        updateWard : async function(wardId,WardName,t)  {
            try{
                const updatedWards = await ward.update(//updates ward data with wardId and returns affetced rows in array format
                    { ward: WardName },
                    {where: {ward_id : wardId},transaction:t}
                );
                if(updatedWards?.[0]===0) throw customException.error(NOT_FOUND,'Please provide a valid ward_id','Data not found');//checks if updatedwards is 0
                return {data:updatedWards};
            }
            catch(error){
                console.log('error in updating data');
                return {err:error};
            }
        },
        //deleting ward with wardId
        deleteWards : async function(wardId,t) {
            try{
                const deletedWards = await ward.destroy(
                    {
                        where: {ward_id:wardId},transaction:t
                    }
                );
                if(!deletedWards&&!deletedWards?.length) throw customException.error(NOT_FOUND,'Please provide a valid ward_id','Data Not Found');
            }
            catch(error){
                console.log('error in deleting data');
                return {err:error};
            }
        },
        //fetching all data along with pagination
        allwards : async function (req) {        
            //function for searchstr to search with whereClause along with like operators
            const createWhereClause = (searchTerm) => {
                return {
                    ward: { 
                        [Op.iLike]: `%${searchTerm}%`
                    }
                }
            }
            try {
                let search = req.query.search||'';
                let searchstr = search.trim();
                const pageNumber = parseInt(req.query.pageNumber) || 1;  
                const pageSize = parseInt(req.query.pageSize) || 10;     
                const orderBy = req.query.orderBy || 'ward';        
                const sortBy = req.query.sortBy || 'ASC';                
                const offset = (pageNumber - 1) * pageSize;
                //checking searchstr if it contains string or null or any integer string
                let whereClause = searchstr && searchstr.toLowerCase() !== 'null' ? createWhereClause(searchstr.replace(/\d+/g, '').trim()||searchstr) : {};
                let { count, rows } = await ward.findAndCountAll({
                    where: whereClause,
                    order: [[orderBy, sortBy]],  
                    limit:pageSize,                       
                    offset,                      
                });
                if (!count&&count?.length) throw customException.error(NOT_FOUND, "Data not found", "There is no data in the ward table.");
                const totalPages = Math.ceil(count / pageSize);
                if (pageNumber > totalPages) throw customException.error(NOT_FOUND, "Page not found", "The requested page does not exist.");
                return { 
                    data: {
                        wards: rows,  
                        totalItems: count,
                        totalPages: totalPages,
                        currentPage: pageNumber
                    }
                };
            }
            catch (err) { 
                console.log('Error in fetching wards:', err.message);
                return {err:err}; 
            }
        }
}

