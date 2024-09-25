const sequelize = require('../config/database');
const villageService= require('../services/villageservice');
const {SUCCESS_CODE,NOT_FOUND,SERVER_ERROR,BAD_REQUEST} = require('../utils/statusCode');
const response = require('../errorHandler/response');
const customException = require('../errorHandler/customException');

/**
 * @swagger
 *  components:
 *      schemas:
 *          Village:
 *              type: object
 *              properties:
 *                  village_id:
 *                      type: integer
 *                      description: This is the district ID
 *                      example: 1
 *                  region:
 *                      type: string
 *                      description: The name of the region
 *                      example: India
 *                  district:
 *                      type: string
 *                      description: The name of the district
 *                      example: AP
 *                  ward:
 *                      type: string
 *                      description: The name of the ward
 *                      example: TPT
 *                  village:
 *                      type: string
 *                      description: The name of the village
 *                      example: SN
 *                  minCurrent:
 *                      type: integer
 *                      description: Minimum current value
 *                      example: 42000
 *                  maxCurrent:
 *                      type: integer
 *                      description: Maximum current value
 *                      example: 42000
 *                  minLast:
 *                      type: integer
 *                      description: Minimum Last value
 *                      example: 42000
 *                  maxLast:
 *                      type: integer
 *                      description: Maximum Last value
 *                      example: 42000
 *                  crop:
 *                      type: string
 *                      description: crop name
 *                      example: new crop
 *                  variety:
 *                      type: string
 *                      description: variety name
 *                      example: new variety
 *                  region_id:
 *                      type: integer
 *                      description: This is the foreign key reference to the region
 *                      example: 1
 *                  district_id:
 *                      type: integer
 *                      description: This is the district ID
 *                      example: 1
 *                  ward_id:
 *                      type: integer
 *                      description: the wardId
 *                      example: 1
 */

/**
 * @swagger
 * /village/{id}/{districtId}/{wardId}:
 *   post:
 *     summary: Insert ward Data
 *     description: Insert ward data into the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the region to which this district belongs
 *       - in: path
 *         name: districtId
 *         required: true
 *         description: The ID of the district to which this ward belongs
 *       - in: path
 *         name: wardId
 *         required: true
 *         description: The ID of the ward to which this village belongs
 *         schema:
 *           type: integer
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *                 description: Name of the ward
 *                 example: India
 *               district:
 *                 type: string
 *                 description: Name of the district
 *                 example: AP
 *               ward:
 *                 type: string
 *                 description: Name of the ward
 *                 example: TPT
 *               village:
 *                 type: string
 *                 description: Name of the village
 *                 example: SN
 *               minCurrent:
 *                 type: integer
 *                 description: Minimum current value
 *                 example: 42000
 *               maxCurrent:
 *                 type: integer
 *                 description: Maximum current value
 *                 example: 42000
 *               minLast:
 *                 type: integer
 *                 description: Minimum last value
 *                 example: 42000
 *               maxLast:
 *                 type: integer
 *                 description: Maximum last value
 *                 example: 42000
 *               crop:
 *                 type: string
 *                 description: crop name
 *                 example: new crop
 *               variety:
 *                 type: string
 *                 description: variety name
 *                 example: new variety
 *     responses:
 *       200:
 *         description: Data inserted successfully
 */

const villagenew = async (req,res)=>{
    try{
        const transaction = await sequelize.transaction();
        const result = await villageService.Datavillage(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        else{
            await transaction.commit();
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{villageD:result.data},'Success','villages created successfully'));
        }
    }
    catch(err){
        console.log('error in giving village',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while creating villages'));
    }
};

/** 
* @swagger
* /village/getdata:
*   get:
*     summary: Get all Villages
*     description: Retrieve a list of all Villages.
*     responses:
*       200:
*         description: A JSON array of village objects
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                  $ref : '#components/schemas/Village'
*/

const villageData = async (req,res)=>{
    try{
        const result = await villageService.villageQuery(req,res);
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{villageD:result.data},'Success','villages fetched successfully'));
    }
    catch(err){
        console.log('error in fetching village',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'));
    }
};


/** 
* @swagger
* /village/query:
*   get:
*     summary: Get all Villages
*     description: Retrieve a list of all  filtered Villages.
*     responses:
*       200:
*         description: A JSON array of village objects
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                  $ref : '#components/schemas/Village'
*/

const villageFilteredData = async (req,res)=>{
    try{
        const result = await villageService.villageDatafiltered(req,res);
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{villageD:result.data},'Success','villages fetched successfully'));
    }
    catch(err){
        console.log('error in fetching village',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'));
    }
};

/**
 * @swagger
 * /village/{id}:
 *   put:
 *     summary: Update village data
 *     description: Update the village data based on the village ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the village to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *                 description: The name of the region.
 *                 example: India
 *     responses:
 *       200:
 *         description: Village data updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Village data updated successfully."
 *       400:
 *         description: Bad request (e.g., invalid data).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid data provided."
 *       404:
 *         description: Village not found (if the ID does not exist).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Village not found."
 */

const updatedvillagedata = async (req,res) => {
    try{
        const transaction = await sequelize.transaction();
        const result = await villageService.updateVillage(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{updatedvillages:result.data.updatedvillages},'Success','Village Updated Successfully'));
    }
    catch(err){
        console.log('Error in updating village data',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'));
    }
};

/**
 * @swagger
 * /village/{id}:
 *   delete:
 *     summary: Delete village data with villageId
 *     description: Soft Delete village data with villageId
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric Id required
 *           schema: 
 *              type: integer
 *     responses:
 *       200:
 *         description: Village data deleted successfully.
 */

const deletedvillagedata = async (req,res) => {
    try{
        const transaction = await sequelize.transaction();
        const result = await villageService.deletevillage(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{deletedvillag:result.data.deletedvillages},'Success','Village deleted Successfully'));
    }
    catch(err){
        console.log('Error in deleting village data',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'));
    }
};

/** 
* @swagger
* /activevillages:
*   get:
*     summary: Get all Active Villages
*     description: Retrieve a list of all Active Villages.
*     responses:
*       200:
*         description: A JSON array of village objects
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                  $ref : '#components/schemas/Village'
*/

const getActiveVillages = async (req,res) => {
    try{
        const transaction = await sequelize.transaction();
        const result = await villageService.activeVillages(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{activeVillage:result.data},'Success','Village fetched Successfully'));
    }
    catch(err){
        console.log('Error in fetching village data',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'));
    }
        
};

module.exports = {villagenew,villageData,villageFilteredData,updatedvillagedata,deletedvillagedata,getActiveVillages};

