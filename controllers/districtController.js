const sequelize = require('../config/database');
const response = require('../errorHandler/response');
const districtService = require('../services/districtservice');
const {SUCCESS_CODE,NOT_FOUND,SERVER_ERROR,BAD_REQUEST} = require('../utils/statusCode');
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
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','districts created successfully'));
        }
    }
    catch(err){
        console.log('error in giving district',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while creating districts'));

    }
};

/**
 * @swagger
 * /districtById/{id}:
 *   get:
 *     summary: Get district data with district ID
 *     description: Retrieve district data using district ID.
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

const districtDataById = async (req,res) => {
    try{
        const result = await districtService.districtById(req);
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','districts fetched successfully'));
    }
    catch(err){
        console.log('error in fetching district',err);
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while fetching districts'));
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
            return res.status(NOT_FOUND).json(response.errorWith(NOT_FOUND,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','districts fetched successfully'));
    }
    catch(err){
        console.log('error in fetching district',err);
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while fetching districts'));
    }
};
module.exports = {districtnew,districtDataById,districtDataByPk};

