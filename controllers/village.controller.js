const customException = require('../errorHandler/customException');
const response = require('../errorHandler/response');
const {SUCCESS_CODE,NOT_FOUND,SERVER_ERROR,BAD_REQUEST} = require('../utils/statusCode');
const sequelize = require('../config/database');
const villageService= require('../services/village.service');

module.exports = {
/**
 * @swagger
 *  components:
 *      schemas:
 *          Village:
 *              type: object
 *              properties:
 *                  village_id:
 *                      type: integer
 *                      description: This is the village ID
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
 *                  maxLast:result
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
 * /village:
 *   post:
 *     tags:
 *       - "Village Service"
 *     summary: Insert ward Data
 *     description: Insert ward data into the database
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token to be passed as a header.
 *         required: true
 *         schema:
 *           type: string
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
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */

    villagenew: async function (req, res) {
        const transaction = await sequelize.transaction();

    try{
        const result = await villageService.Datavillage(req,transaction);
        if(result?.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, { village: result.data }, result.message, result.displayMessage));
    }
    catch(err){
        await transaction.rollback();
        console.log('error in giving village',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while creating villages'));
    }
},

/**
 * @swagger
 * /village/{id}:
 *   get:
 *     tags:
 *       - "Village Service"
 *     summary: get village data with primary key
 *     description: Retrieve village data with primary key.
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           description: Token to be passed as a header.
 *           required: true
 *           schema:
 *              type: string
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric Id required
 *           schema: 
 *              type: integer
 *     responses:
 *       200:
 *         description: A JSON array of Village object
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref : '#components/schemas/Village'
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */

villageByPK: async function(req,res){
    try{
        const result = await villageService.villageByPk(req.params.id);
        if(result?.err) return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{village:result.data},'Success','villages fetched successfully'));
    }
    catch(err){
        console.log('error in fetching village',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'));
    }
},

/**
 * @swagger
 * /village/{id}:
 *   put:
 *     tags:
 *       - "Village Service"
 *     summary: Update village data
 *     description: Update the village data based on the village ID.
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Token to be passed as a header.
 *         required: true
 *         schema:
 *            type: string
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
 *               village:
 *                 type: string
 *                 description: The name of the village.
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
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */

updatedvillagedata:async function (req,res) {
    try{
        const transaction = await sequelize.transaction();
        const result = await villageService.updateVillage(req.body.village,req.params.id,transaction);
        if(result?.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{updatedvillages:result.data},'Success','Village Updated Successfully'));
    }
    catch(err){
        console.log('Error in updating village data',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'));
    }
},

/**
 * @swagger
 * /village/{id}:
 *   delete:
 *     tags:
 *       - "Village Service"
 *     summary: Delete village data with villageId
 *     description: Soft Delete village data with villageId
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           description: Token to be passed as a header.
 *           required: true
 *           schema:
 *              type: string
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric Id required
 *           schema: 
 *              type: integer
 *     responses:
 *       200:
 *         description: Village data deleted successfully.
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */

deletedvillagedata: async function(req,res) {
    try{
        const transaction = await sequelize.transaction();
        const result = await villageService.deletevillage(req.params.id,transaction);
        if(result?.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{deletedvillag:result.data},'Success','Village deleted Successfully'));
    }
    catch(err){
        console.log('Error in deleting village data',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'));
    }
},

/**
 * @swagger
 * /paginatedData:
 *   get:
 *     tags:
 *       - "Village Service"
 *     summary: Get village data with pagination
 *     description: Retrieve paginated village data with sorting options.
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           description: Token to be passed as a header.
 *           required: true
 *           schema:
 *              type: string
 *         - in: query
 *           name: search
 *           description: search with village name
 *           schema: 
 *              type: string
 *         - in: query
 *           name: pageNumber
 *           description: The page number to retrieve (starting from 1).
 *           schema: 
 *              type: integer
 *         - in: query
 *           name: pageSize
 *           description: The number of villages to return per page.
 *           schema: 
 *              type: integer
 *         - in: query
 *           name: orderBy
 *           description: The column to order by (e.g., 'village').
 *           schema: 
 *              type: string
 *         - in: query
 *           name: sortBy
 *           description: The sorting direction (ASC or DESC).
 *           schema: 
 *              type: string
 *     responses:
 *       200:
 *         description: A paginated list of villages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 villages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Village'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       404:
 *         description: The requested page does not exist
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */

allvillageData:async function(req, res) {
    try {
        const result = await villageService.allvillages(req);
        if (result?.err) return res.status(NOT_FOUND).json(customException.error(NOT_FOUND, result.err.message, 'Failed to fetch villages'));
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, {villages: result.data }, 'Success', 'Villages fetched successfully'));
    } catch (err) {
        console.log('Error in fetching villages', err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while fetching villages'));
    }
},

/**
 * @swagger
 * /villageName:
 *   get:
 *     tags:
 *       - "Village Service"
 *     summary: fetch village,ward,region for each villageName
 *     description: retrive village,ward,region data
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           description: Token to be passed as a header.
 *           required: true
 *           schema:
 *              type: string
 *     responses:
 *       200:
 *         description: Data inserted successfully
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */


databyVllageName : async function(req, res) {
    try {
        const result = await villageService.fetchVillageName(req);
        if (result?.err) return res.status(NOT_FOUND).json(customException.error(NOT_FOUND, result.err.message, result.err.displayMessage));
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, { data: result.data }, 'Success', 'Villages fetched successfully'));
    } catch (err) {
        console.log('Error in fetching villages:', err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while fetching villages'));
    }
},

/**
 * @swagger
 * /villageByWard:
 *   get:
 *     tags:
 *       - "Village Service"
 *     summary: count the no. of villages in each ward
 *     description: Retrieve village data
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           description: Token to be passed as a header.
 *           required: true
 *           schema:
 *              type: string
 *     responses:
 *       200:
 *         description: A JSON array of Village object
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */

villagebyward : async function (req, res) {
    try {
        const result = await villageService.villagesbyward(req);
        if (result?.err) return res.status(NOT_FOUND).json(customException.error(NOT_FOUND, result.err.message, result.err.displayMessage));
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, { data: result.data }, 'Success', 'Villages fetched successfully'));
    } 
    catch (err) {
        console.log('Error in fetching villages:', err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while fetching villages'));
    }
},

/**
 * @swagger
 * /villageregion:
 *   get:
 *     tags:
 *       - "Village Service"
 *     summary: fetch region names where village is present
 *     description: Retrieve region data 
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           description: Token to be passed as a header.
 *           required: true
 *           schema:
 *              type: string
 *     responses:
 *       200:
 *         description: A JSON array of Village object
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */

fetchRegions : async function (req,res){
    try {
        const result = await villageService.fetchRegion(req);
        if (result?.err) return res.status(NOT_FOUND).json(customException.error(NOT_FOUND, result.err.message, result.err.displayMessage));
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, { data: result.data }, 'Success', 'Villages fetched successfully'));
    } 
    catch (err) {
        console.log('Error in fetching villages:', err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while fetching villages'));
    }
},

/**
 * @swagger
 * /wardsByVillage:
 *   get:
 *     tags:
 *       - "Village Service"
 *     summary: fetch ward names that have morethan 1 village.
 *     description: Retrieve region data 
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           description: Token to be passed as a header.
 *           required: true
 *           schema:
 *              type: string
 *     responses:
 *       200:
 *         description: A JSON array of Village object
 */

fetchWardsData : async function (req,res){
    try{
        const result = await villageService.fetchWards(req);
        if (result?.err) return res.status(NOT_FOUND).json(customException.error(NOT_FOUND, result.err.message, result.err.displayMessage));
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, { data: result.data }, 'Success', 'Villages fetched successfully'));
    }
    catch (err) {
        console.log('Error in fetching villages:', err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while fetching villages'));
    }
}
}