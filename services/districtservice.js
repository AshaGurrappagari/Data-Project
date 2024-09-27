
const customException = require('../errorHandler/customException');
const districtSchema = require('../joidata/districtSchema');
const District = require('../models/district');
const { NOT_FOUND } = require('../utils/statusCode');

const districtData = async (req,t)=>{
    try{
        const regionId = req.params.id;
        const validatedData = await districtSchema.validateAsync(req.body);


        const newdistrict = await District.create(
            {
                district:validatedData.district,
                regionId :regionId
            },{transaction:t});
        console.log('District created',newdistrict);
        return {data:newdistrict};
    }
    catch(err){
        console.log('district data not successfully created:',err);
        return {err:err};
    }
};

const alldistricts = async (req) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;  
        const pageSize = parseInt(req.query.pageSize) || 10;     
        const orderBy = req.query.orderBy || 'district_id';        
        const sortBy = req.query.sortBy || 'ASC';                

        const offset = (pageNumber - 1) * pageSize;
        const limit = pageSize;

        const { count, rows } = await District.findAndCountAll({
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
                districts: rows,  
                totalItems: count,
                totalPages: totalPages,
                currentPage: pageNumber
            }
        };
    }
    catch (err) {
        console.log('Error in fetching districts:', err.message);
        return {err:err}; 
    }
};

const districtByPk = async (req) => {
    try{
        const Id = req.params.id;
        const district = await District.findByPk(Id);
        if(!district||district.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data not found');
        }
        return {data:district};
    }
    catch(err){
        console.log('error in fetching district',err);
        return {err:err};
    }
};

const updateDistricts = async (req,t) => {
    try{
        const districtId = req.params.id;
        const districtName = req.body.district;
        const updatedDistricts = await District.update(
            { district: districtName },
            {where: {district_id : districtId},transaction:t}
        );
        if(!updatedDistricts||updatedDistricts.error){
            throw customException.error(NOT_FOUND,'Please provide a valid district_id','Data not found');
        }
        return {data:{updatedDistricts}};
    }
    catch(error){
        console.log('error in updating data');
        return {err:error};
    }
};

const  deleteDistrict= async (req,t) =>{
    try{
        const districtId= req.params.id;

        const deletedDistricts = await District.destroy(
            {
                where: {district_id:districtId},transaction:t
            }
        );
        if(!deletedDistricts||deletedDistricts.error){
            throw customException.error(NOT_FOUND,'Please provide a valid district_id','Data Not Found');
        }
        return {data:{deletedDistricts}};

    }
    catch(error){
        console.log('error in deleting data');
        return {err:error};
    }
};


module.exports = {districtData,alldistricts,districtByPk,updateDistricts,deleteDistrict};
