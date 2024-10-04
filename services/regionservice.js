const customException = require('../errorHandler/customException');
const regionModel = require('../models/region');
const regionSchema = require('../joidata/regionSchema');
const { NOT_FOUND} = require('../utils/statusCode');
const {Op} = require('sequelize')

const regionData = async (req, t) => {
    try {
        const validatedData = await regionSchema.validateAsync(req.body);
                
        const [region, created] = await regionModel.findOrCreate({
            where: { region: validatedData.region },
            defaults: {
                region: validatedData.region
            },
            transaction: t 
        });

        if (created) {
            console.log('New region created:', region);
            return { data: region };
        } else {
            console.log('Region already exists:', region);
            return { data: region, message: 'Region already exists' }; 
        }

    } catch (err) {
        console.log('Region data not successfully created:', err);
        return { err: err };
    }
};



const regionByPk = async (req) => {
    try{
        const Id = req.params.id;
        const region = await regionModel.findByPk(Id);
        if(!region||region.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data Not Found');
        }
        return {data:region};
    }
    catch(err){
        console.log('error in fetching region',err);
        return {err:err};
    }
};

const updateRegion = async (req,t) => {
    try{
        const regionId = req.params.id;
        const regionName = req.body.region;

        const foundRegion = await regionModel.findByPk(regionId);
        if (!foundRegion) {
            throw customException.error(NOT_FOUND, 'Please provide a valid region_id', 'Data Not Found');
        }
        const updatedRegions = await regionModel.update(
            { region: regionName },
            {where: {region_id : regionId},transaction:t}
        );
        if(!updatedRegions||updatedRegions.error){
            throw customException.error(NOT_FOUND,'Please provide a valid region_id','Data not found');
        }
        return {data:{updatedRegions}};
    }
    catch(error){
        console.log('error in updating data');
        return {err:error};
    }
};

const deleteRegion = async (req,t) =>{
    try{
        const regionId = req.params.id;

        const foundRegion = await regionModel.findByPk(regionId);
        if (!foundRegion) {
            throw customException.error(NOT_FOUND, 'Please provide a valid region_id', 'Data Not Found');
        }
        const deletedRegions = await regionModel.destroy(
            {
                where: {region_id:regionId},transaction:t
            }
        );
        if(!deletedRegions||deletedRegions.error){
            throw customException.error(NOT_FOUND,'Please provide a valid region_id','Data Not Found');
        }
        return {data:{deletedRegions}};

    }
    catch(error){
        console.log('error in deleting data');
        return {err:error};
    }
};

const allregion = async (req) => {
    try {
        let search = req.query.search || '';
        let searchstr = search.trim();

        const pageNumber = parseInt(req.query.pageNumber) || 1;  
        const pageSize = parseInt(req.query.pageSize) || 10;     
        const orderBy = req.query.orderBy || 'region';        
        const sortBy = req.query.sortBy || 'ASC';                

        const offset = (pageNumber - 1) * pageSize;
        const limit = pageSize;

        let whereClause = {};
        if (searchstr && searchstr.toLowerCase() !== 'null') {
            whereClause = {
                region: { 
                    [Op.iLike]: `%${searchstr}%`
                }
            };
        }

        let { count, rows } = await regionModel.findAndCountAll({
            where: whereClause,
            order: [[orderBy, sortBy]],  
            limit,                       
            offset,                      
        });

        if (count === 0 && searchstr) {
            let searchWithoutNumbers = searchstr.replace(/\d+/g, '').trim();
            
            if (searchWithoutNumbers) {
                const whereClauseWithoutNumbers = {
                    region: { 
                        [Op.iLike]: `%${searchWithoutNumbers}%`
                    }
                };

                ({ count, rows } = await regionModel.findAndCountAll({
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
            throw customException.error(NOT_FOUND, "Data not found", "There is no data in the region table.");
        }

        const totalPages = Math.ceil(count / pageSize);

        if (pageNumber > totalPages) {
            throw customException.error(NOT_FOUND, "Page not found", "The requested page does not exist.");
        }

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
};

module.exports = {regionData,allregion,regionByPk,updateRegion,deleteRegion};
