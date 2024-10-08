const sequelize = require('../config/database');
const wardService = require('../services/wardservice');
const {SUCCESS_CODE,NOT_FOUND,SERVER_ERROR,BAD_REQUEST} = require('../utils/statusCode');
const response = require('../errorHandler/response');
const customException = require('../errorHandler/customException');

/**
 * @swagger
 *  components:
 *      schemas:
 *          Ward:
 *              type: object
 *              properties:
 *                  ward_id:
 *                      type: integer
 *                      description: the wardId
 *                      example: 1
 *                  ward:
 *                      type: string
 *                      description: ward Name
 *                      example: Tirupati
 *                  district_id: 
 *                      type: integer
 *                      description: foreign key with reference with district 
 *                      example: 1
 */

/**
 * @swagger
 * /ward/{id}:
 *   post:
 *     summary: Insert ward Data
 *     description: Insert ward data into the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the district to which this ward belongs
 *         schema:
 *           type: integer
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ward:
 *                 type: string
 *                 description: Name of the ward
 *                 example: Tirupati
 *     responses:
 *       200:
 *         description: Data inserted successfully
 */

const wardnew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await wardService.wardData(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        else{
            await transaction.commit();
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{wards:result.data},'Success','wards created successfully'));
        }
    }
    catch(err){
        console.log('error in giving ward',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while creating wards'));
    }
};

/**
 * @swagger
 * /wardbyPk/{id}:
 *   get:
 *     summary: get ward data with primary key
 *     description: Retrieve ward data with primary key.
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric Id required
 *           schema: 
 *              type: integer
 *     responses:
 *       200:
 *         description: A JSON array of ward object
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref : '#components/schemas/Ward'
 */

const wardDataByPk = async (req,res) => {
    try{
        const result = await wardService.wardByPk(req);
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{wards:result.data},'Success','wards fetched successfully'));
    }
    catch(err){
        console.log('error in fetching ward',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching wards'));
    }
};

/**
 * @swagger
 * /ward/{id}:
 *   put:
 *     summary: update ward data with wardId
 *     description: Soft update ward data with wardId
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
 *               ward:
 *                 type: string
 *                 description: The name of the ward.
 *                 example: TPT

 *     responses:
 *       200:
 *         description: ward data updated successfully.
 */


const updatedWardData = async (req,res) =>{
    try{
        const transaction = await sequelize.transaction();
        const result = await wardService.updateWard(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{updatedDistricts:result.data.updatedDistricts},'Success','ward Data Updated Successfully'));
    }
    catch(err){
        console.log('Error in updating ward',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while updating wards'));
    }
};

/**
 * @swagger
 * /ward/{id}:
 *   delete:
 *     summary: Delete ward data with wardId
 *     description: Soft Delete ward data with wardId
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric Id required
 *           schema: 
 *              type: integer
 *     responses:
 *       200:
 *         description: ward data deleted successfully.
 */


const deletedWardData = async (req,res) =>{
    try{
        const transaction = await sequelize.transaction();
        const result = await wardService.deleteWards(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{updatedDistricts:result.data.updatedDistricts},'Success','ward Data Deleted Successfully'));
    }
    catch(err){
        console.log('Error in deleting wards',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while deleting wards'));
    }
};

// /**
//  * @swagger
//  * /warddata:
//  *   get:
//  *     summary: Get all wards
//  *     description: Retrieve a list of all wards.
//  *     responses:
//  *       200:
//  *         description: A JSON array of ward objects
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                  $ref : '#components/schemas/Ward'
//  */

/**
 * @swagger
 * /wardData:
 *   get:
 *     summary: Get ward data with pagination
 *     description: Retrieve paginated ward data with sorting options.
 *     parameters:
 *         - in: query
 *           name: pageNumber
 *           description: The page number to retrieve (starting from 1).
 *           schema: 
 *              type: integer
 *         - in: query
 *           name: pageSize
 *           description: The number of wards to return per page.
 *           schema: 
 *              type: integer
 *         - in: query
 *           name: orderBy
 *           description: The column to order by (e.g., 'ward_id').
 *           schema: 
 *              type: string
 *         - in: query
 *           name: sortBy
 *           description: The sorting direction (ASC or DESC).
 *           schema: 
 *              type: string
 *     responses:
 *       200:
 *         description: A paginated list of wards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ward'
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


const allwardsData = async (req,res) => {
    try {
        const result = await wardService.allwards(req);

        if (result.err) {
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND, result.err.message, 'Failed to fetch wards'));
        }

        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, {
            wards: result.data.wards, 
            totalItems: result.data.totalItems,
            totalPages: result.data.totalPages,
            currentPage: result.data.currentPage
        }, 'Success', 'wards fetched successfully'));

    } catch (err) {
        console.log('Error in fetching wards', err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while fetching wards'));
    }
};
module.exports = {wardnew,wardDataByPk,updatedWardData,deletedWardData,allwardsData};

