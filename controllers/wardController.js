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

/**
 * @swagger
 * /wardbyId/{id}:
 *   get:
 *     summary: Get ward data with wardId
 *     description: Retrieve ward data with wardId.
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
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','wards created successfully'));
        }
    }
    catch(err){
        console.log('error in giving ward',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while creating wards'));
    }
};

const wardDataById = async (req,res) => {
    try{
        const result = await wardService.wardById(req);
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','wards fetched successfully'));
    }
    catch(err){
        console.log('error in fetching ward',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching wards'));
    }
};

const wardDataByPk = async (req,res) => {
    try{
        const result = await wardService.wardByPk(req);
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','wards fetched successfully'));
    }
    catch(err){
        console.log('error in fetching ward',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching wards'));
    }
};


module.exports = {wardnew,wardDataById,wardDataByPk};

