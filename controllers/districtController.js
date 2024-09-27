const sequelize = require('../config/database');
const response = require('../errorHandler/response');
const districtService = require('../services/districtservice');
const {SUCCESS_CODE,SERVER_ERROR,BAD_REQUEST, NOT_FOUND} = require('../utils/statusCode');
const customException = require('../errorHandler/customException');

/**
 * @swagger
 *  components:
 *      schemas:
 *          District:
 *              type: object
 *              properties:
 *                  district_id:
 *                      type: integer
 *                      description: This is the district ID
 *                      example: 1
 *                  district:
 *                      type: string
 *                      description: The name of the district
 *                      example: India
 *                  region_id:
 *                      type: integer
 *                      description: This is the foreign key reference to the region
 *                      example: 1
 */

/**
 * @swagger
 * /district/{id}:
 *   post:
 *     summary: Insert District Data
 *     description: Insert district data into the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the region to which this district belongs
 *         schema:
 *           type: integer
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               district:
 *                 type: string
 *                 description: Name of the district
 *                 example: Andhra Pradesh
 *     responses:
 *       200:
 *         description: Data inserted successfully
 */

const districtnew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await districtService.districtData(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        else{
            await transaction.commit();
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{districtD:result.data},'Success','districts created successfully'));
        }
    }
    catch(err){
        console.log('error in giving district',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while creating districts'));

    }
};

/**
 * @swagger
 * /districtByPK/{id}:
 *   get:
 *     summary: Get district data with primary key
 *     description: Retrieve district data with primary key.
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: Numeric ID required
 *           schema: 
 *              type: integer
 *     responses:
 *       200:
 *         description: A JSON object of the district
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/District'
 */


const districtDataByPk = async (req,res) => {
    try{
        const result = await districtService.districtByPk(req);
        if(result.err){
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{districtD:result.data},'Success','districts fetched successfully'));
    }
    catch(err){
        console.log('error in fetching district',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching districts'));
    }
};

/**
 * @swagger
 * /district/{id}:
 *   put:
 *     summary: update district data with districtId
 *     description: Soft update district data with districtId
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric Id required
 *           schema: 
 *              type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               district:
 *                 type: string
 *                 description: The name of the district.
 *                 example: AP

 *     responses:
 *       200:
 *         description: district data updated successfully.
 */


const updatedDistrictData = async (req,res) =>{
    try{
        const transaction = await sequelize.transaction();
        const result = await districtService.updateDistricts(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{updatedDistricts:result.data.updatedDistricts},'Success','District Data Updated Successfully'));
    }
    catch(err){
        console.log('Error in updating district',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while updating districts'));
    }
};

/**
 * @swagger
 * /district/{id}:
 *   delete:
 *     summary: Delete district data with districtId
 *     description: Soft Delete district data with districtId
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric Id required
 *           schema: 
 *              type: integer
 *     responses:
 *       200:
 *         description: district data deleted successfully.
 */


const deletedDistrictsData = async (req,res) =>{
    try{
        const transaction = await sequelize.transaction();
        const result = await districtService.deleteDistrict(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{deletedDistricts:result.data.deletedDistricts},'Success','District Data Deleted Successfully'));
    }
    catch(err){
        console.log('Error in deleting district',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while deleting districts'));
    }
};

/**
 * @swagger
 * /districtData:
 *   get:
 *     summary: Get district data with pagination
 *     description: Retrieve paginated district data with sorting options.
 *     parameters:
 *         - in: query
 *           name: pageNumber
 *           description: The page number to retrieve (starting from 1).
 *           schema: 
 *              type: integer
 *         - in: query
 *           name: pageSize
 *           description: The number of districts to return per page.
 *           schema: 
 *              type: integer
 *         - in: query
 *           name: orderBy
 *           description: The column to order by (e.g., 'district_id').
 *           schema: 
 *              type: string
 *         - in: query
 *           name: sortBy
 *           description: The sorting direction (ASC or DESC).
 *           schema: 
 *              type: string
 *     responses:
 *       200:
 *         description: A paginated list of districts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 districts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/District'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       404:
 *         description: The requested page does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 displayMessage:
 *                   type: string
 *       500:
 *         description: An internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 displayMessage:
 *                   type: string
 */

const alldistrictsData = async (req,res) => {
    try {
        const result = await districtService.alldistricts(req);

        if (result.err) {
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND, result.err.message, 'Failed to fetch districts'));
        }

        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, {
            districts: result.data.districts, 
            totalItems: result.data.totalItems,
            totalPages: result.data.totalPages,
            currentPage: result.data.currentPage
        }, 'Success', 'districts fetched successfully'));

    } catch (err) {
        console.log('Error in fetching districts', err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while fetching districts'));
    }
};



module.exports = {districtnew,districtDataByPk,updatedDistrictData,deletedDistrictsData,alldistrictsData};

