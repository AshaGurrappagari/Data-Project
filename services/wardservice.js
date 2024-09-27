const customException = require('../errorHandler/customException');
const  wardSchema  = require('../joidata/wardSchema');
const ward = require('../models/ward');
const { NOT_FOUND } = require('../utils/statusCode');

const wardData = async (req,t) => {
    try{
        const validatedData = await wardSchema.validateAsync(req.body);
        const districtId = req.params.id;

        const newward = await ward.create({
            ward:validatedData.ward,
            districtId :districtId
        },{transaction:t}
        );
        console.log('ward creeated',newward);
        return {data:newward};
    }
    catch(err){
        console.log('error in giving ward',err);
        return {err:err};
    }
};

const wardByPk = async (req) => {
    try{
        const Id = req.params.id;
        const wardId = await ward.findByPk(Id);
        if(!wardId||wardId.length === 0){
            throw customException.error(NOT_FOUND,'Enter a valid data','Data Not Found');
        }
        const newdata = JSON.stringify(wardId);
        const newstring = JSON.parse(newdata);
        console.log('====>\n',newstring);
        return {data:newstring};
    }
    catch(err){
        console.log('error in fetching ward',err);
        return {err:err};
    }
};

const updateWard = async (req,t) => {
    try{
        const wardId = req.params.id;
        const WardName = req.body.ward;
        const updatedWards = await ward.update(
            { ward: WardName },
            {where: {ward_id : wardId},transaction:t}
        );
        if(!updatedWards||updatedWards.error){
            throw customException.error(NOT_FOUND,'Please provide a valid ward_id','Data not found');
        }
        return {data:{updatedWards}};
    }
    catch(error){
        console.log('error in updating data');
        return {err:error};
    }
};

const deleteWards = async (req,t) =>{
    try{
        const wardId = req.params.id;
        const deletedWards = await ward.destroy(
            {
                where: {ward_id:wardId},transaction:t
            }
        );
        if(!deletedWards||deletedWards.error){
            throw customException.error(NOT_FOUND,'Please provide a valid ward_is','Data Not Found');
        }
        return {data:{deletedWards}};

    }
    catch(error){
        console.log('error in deleting data');
        return {err:error};
    }
};

const allwards = async (req) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;  
        const pageSize = parseInt(req.query.pageSize) || 10;     
        const orderBy = req.query.orderBy || 'ward_id';        
        const sortBy = req.query.sortBy || 'ASC';                

        const offset = (pageNumber - 1) * pageSize;
        const limit = pageSize;

        const { count, rows } = await ward.findAndCountAll({
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

};

module.exports = {wardData,wardByPk,updateWard,deleteWards,allwards};

