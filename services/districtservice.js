
const customException = require('../errorHandler/customException');
const districtSchema = require('../joidata/districtSchema');
const District = require('../models/district');
const Region = require('../models/region');
const { NOT_FOUND } = require('../utils/statusCode');
const {Op} = require('sequelize');

const districtData = async (req, t) => {
    try {
        const validatedData = await districtSchema.validateAsync(req.body);

        const foundRegion = await Region.findOne({
            where: { region: validatedData.region } 
        });

        if (!foundRegion) {
            throw customException.error(NOT_FOUND, 'Region not found', 'The specified region does not exist in the database.');
        }
        const newDistrict = await District.create(
            {
                district: validatedData.district,
                regionId: foundRegion.region_id,  
            },
            { transaction: t }
        );

        console.log('District created', newDistrict);
        return { data: newDistrict };
    } catch (err) {
        console.log('District data not successfully created:', err);
        return { err: err };
    }
};


const alldistricts = async (req) => {
    try {
        let search = req.query.search || '';
        let searchstr = search.trim();

        const pageNumber = parseInt(req.query.pageNumber) || 1;  
        const pageSize = parseInt(req.query.pageSize) || 10;     
        const orderBy = req.query.orderBy || 'district';        
        const sortBy = req.query.sortBy || 'ASC';                

        const offset = (pageNumber - 1) * pageSize;
        const limit = pageSize;

        let whereClause = {};
        if (searchstr && searchstr.toLowerCase() !== 'null') {
            whereClause = {
                district: { 
                    [Op.iLike]: `%${searchstr}%`
                }
            };
        }

        let { count, rows } = await District.findAndCountAll({
            where: whereClause,
            order: [[orderBy, sortBy]],  
            limit,                       
            offset,                      
        });

        if (count === 0 && searchstr) {
            let searchWithoutNumbers = searchstr.replace(/\d+/g, '').trim();
            
            if (searchWithoutNumbers) {
                const whereClauseWithoutNumbers = {
                    district: { 
                        [Op.iLike]: `%${searchWithoutNumbers}%`
                    }
                };

                ({ count, rows } = await District.findAndCountAll({
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
            throw customException.error(NOT_FOUND, "Data not found", "There is no data in the district table.");
        }

        const totalPages = Math.ceil(count / pageSize);

        if (pageNumber > totalPages) {
            throw customException.error(NOT_FOUND, "Page not found", "The requested page does not exist.");
        }

        return {
            data: {
                districts: rows,  
                totalItems: count,
                totalPages: totalPages,
                currentPage: pageNumber
            }
        };
    } catch (err) {
        console.error('Error in fetching Districts:', err.message);
        return { err: err }; 
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

        const foundDistrict = await District.findByPk(districtId);
        if (!foundDistrict) {
            throw customException.error(NOT_FOUND, 'Please provide a valid district_id', 'Data Not Found');
        }
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
        const foundDistrict = await District.findByPk(districtId);
        if (!foundDistrict) {
            throw customException.error(NOT_FOUND, 'Please provide a valid district_id', 'Data Not Found');
        }
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
