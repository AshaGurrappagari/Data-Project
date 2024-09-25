const sequelize = require('../config/database');
const customException = require('../errorHandler/customException');
const response = require('../errorHandler/response');
const regionService = require('../services/regionservice');
const {SUCCESS_CODE,NOT_FOUND,SERVER_ERROR,BAD_REQUEST} = require('../utils/statusCode');

/**
 * @swagger
 *  components:
 *      schemas:
 *          Region:
 *              type: object
 *              properties:
 *                  region_id:
 *                      type: integer
 *                      description: this is regionId
 *                      example: 1
 *                  region:
 *                      type: string
 *                      description: the name
 *                      example: India
 */

/**
 * @swagger
 * /region:
 *   post:
 *     summary: Insert Region Data
 *     description: Insert Region Data into the database
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Region'
 *     responses:
 *       200:
 *         description: Data inserted successfully
 */

/**
 * @swagger
 * /regiondata:
 *   get:
 *     summary: Get all regions
 *     description: Retrieve a list of all regions.
 *     responses:
 *       200:
 *         description: A JSON array of region objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref : '#components/schemas/Region'
 */

/**
 * @swagger
 * /region/{id}:
 *   get:
 *     summary: Get region data with regionId
 *     description: Retrieve region data with regionId.
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric Id required
 *           schema: 
 *              type: integer
 *     responses:
 *       200:
 *         description: A JSON array of region object
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref : '#components/schemas/Region'
 */


/**
 * @swagger
 * /regionbyPk/{id}:
 *   get:
 *     summary: get region data with primary key
 *     description: Retrieve region data with primary key.
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric Id required
 *           schema: 
 *              type: integer
 *     responses:
 *       200:
 *         description: A JSON array of region object
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref : '#components/schemas/Region'
 */

const regionnew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await regionService.regionData(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        else{
            await transaction.commit();
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','Regions created successfully'));
        }
    }
    catch(err){
        console.log('error in giving region',err);
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while creating regions'));
    }
};

const regionnewdata = async (req,res) =>{
    try{
        const result = await regionService.allregion(req);
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','Regions fetched successfully'));
    }
    catch(err){
        console.log('error in fetching region',err);
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while fetching regions'));
    }
};

const regiondatabyId = async (req,res) => {
    try{
        const result = await regionService.regionById(req);
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','Regions fetched successfully'));
    }
    catch(err){
        console.log('error in fetching region',err);
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,err.displayMessage||'An error occurred while fetching regions'));
    }
};

const regionDataByPk = async (req,res) => {
    try{
        const result = await regionService.regionByPk(req);
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','Regions fetched successfully'));
    }
    catch(err){
        console.log('error in fetching region',err);
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while fetching regions'));
    }
};
module.exports = {regionnew,regionnewdata,regiondatabyId,regionDataByPk};
