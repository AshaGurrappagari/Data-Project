const customException = require('../errorHandler/customException');
const District = require('../models/district.model');
const { NOT_FOUND ,DATA_ALREADY_EXISTS,BAD_REQUEST} = require('../utils/statusCode');
const {Op}  = require('sequelize');
const Ward = require('../models/ward.model');

module.exports = {
        // service to create Ward data if not present in database
        wardData : async function (req,t) {
            try{
                const { district,ward } = req.body; 
                const foundDistrict = await District.findOne({ where: { district: district } });
                if (!foundDistrict) throw customException.error(NOT_FOUND, 'district not found', 'Data not found');

            const created = await Ward.findOne({
                where:{
                    ward:ward,
                    districtId: foundDistrict.district_id,  
                }
            })
            if(created) return {data:created, httpStatusCode: DATA_ALREADY_EXISTS,message: 'Please provide a different ward name',displayMessage: 'Ward data already Created'}

            const newWard = await Ward.create({
                    ward:ward,
                    districtId: foundDistrict.district_id,  
            },t)
            
            if(!newWard) throw customException.error(BAD_REQUEST,'Error while creating District Data','District data not Succefully created'); 
            return {data:newWard,message:'Created Successfully', displayMessage:'Ward Created Successfully'}
            }
            catch(err){ 
                console.log('error in giving ward',err);
                return {err:err};
            }
        },
        //fetching data with primary Key
        wardByPk : async function (Id)  {
            try{
                const wards = await Ward.findByPk(Id);
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
                const updatedWards = await Ward.update(//updates ward data with wardId and returns affetced rows in array format
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
                const deletedWards = await Ward.destroy(
                    {
                        where: {ward_id:wardId},transaction:t
                    }
                );
                if(!deletedWards&&!deletedWards?.length) throw customException.error(NOT_FOUND,'Please provide a valid ward_id','Data Not Found');
                return {data:deletedWards}
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
                let { count, rows } = await Ward.findAndCountAll({
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

