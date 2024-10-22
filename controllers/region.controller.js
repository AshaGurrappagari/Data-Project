const customException = require('../errorHandler/customException');
const regionService = require('../services/region.service');
const response = require('../errorHandler/response');
const sequelize = require('../config/database');
const {SUCCESS_CODE,NOT_FOUND,SERVER_ERROR,BAD_REQUEST} = require('../utils/statusCode');

module.exports = {
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
 *     tags:
 *       - "Region Service"
 *     summary: Insert Region Data
 *     description: Insert Region Data into the database
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
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
 *             $ref: '#/components/schemas/Region'
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

regionnew : async function(req,res){
    try{
        const transaction = await sequelize.transaction();
        const result = await regionService.regionData(req,transaction);
        if(result?.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        else{
            await transaction.commit();
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, { regionD: result.data },result.message , result.displayMessage));
        }
    }
    catch(err){
        console.log('error in giving region',err);
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while creating regions'));
    }
},

/**
 * @swagger
 * /regionbyPk/{id}:
 *   get:
 *     tags:
 *       - "Region Service"
 *     summary: get region data with primary key
 *     description: Retrieve region data with primary key.
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
 *         description: A JSON array of region object
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref : '#components/schemas/Region'
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */

regionDataByPk : async function (req,res) {
    try{
        const result = await regionService.regionByPk(req.params.id);
        if(result?.err) return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','Regions fetched successfully'));
    }
    catch(err){
        console.log('error in fetching region',err);
        return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while fetching regions'));
    }
},

/**
 * @swagger
 * /region/{id}:
 *   put:
 *     tags:
 *       - "Region Service"
 *     summary: update region data with regionId
 *     description: Soft update region data with regionId
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
 *                 example: TPT

 *     responses:
 *       200:
 *         description: region data updated successfully.
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */

updatedRegiondata : async function (req,res) {
    try{
        const transaction = await sequelize.transaction();
        const result = await regionService.updateRegion(req.params.id,req.body.region,transaction);
        if(result?.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{updatedRegions:result.data},'Success','Region updated Successfully'));
    }
    catch(err){
        console.log('Error in updating region data');
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while updating regions'));
    }
},

/**
 * @swagger
 * /region/{id}:
 *   delete:
 *     tags:
 *       - "Region Service"
 *     summary: Delete region data with regionId
 *     description: Soft Delete region data with regionId
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
 *         description: region data deleted successfully.
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */

deletedRegiondata : async function(req,res) {
    try{
        const transaction = await sequelize.transaction();
        const result = await regionService.deleteRegion(req,transaction);
        if(result?.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{deletedRegions:result.data.deletedRegions},'Success','Region deleted Successfully'));
    }
    catch(err){
        console.log('Error in deleting region data',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while deleting regions'));
    }
},

/**
 * @swagger
 * /regionData:
 *   get:
 *     tags:
 *       - "Region Service"
 *     summary: Get region data with pagination
 *     description: Retrieve paginated region data with sorting options.
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           description: Token to be passed as a header.
 *           required: true
 *           schema:
 *              type: string
 *         - in: query
 *           name: search
 *           description: search with region name
 *           schema: 
 *              type: string
 *         - in: query
 *           name: pageNumber
 *           description: The page number to retrieve (starting from 1).
 *           schema: 
 *              type: integer
 *         - in: query
 *           name: pageSize
 *           description: The number of regions to return per page.
 *           schema: 
 *              type: integer
 *         - in: query
 *           name: orderBy
 *           description: The column to order by (e.g., 'region_id').
 *           schema: 
 *              type: string
 *         - in: query
 *           name: sortBy
 *           description: The sorting direction (ASC or DESC).
 *           schema: 
 *              type: string
 *     responses:
 *       200:
 *         description: A paginated list of regions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 regions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Region'
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

allregionData : async function(req, res) {
    try {
        const result = await regionService.allregion(req);
        if (result?.err) return res.status(NOT_FOUND).json(customException.error(NOT_FOUND, result.err.message, 'Failed to fetch regions'));
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, {regions:result.data}, 'Success', 'regions fetched successfully'));
    } catch (err) {
        console.log('Error in fetching regions', err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while fetching regions'));
    }
}

}


//create 1 branch from main
//insert,update,delete,fetch-2 in same api
//deletedAt in all tables
//pagination pagenum, pagesize, orderby, sortby
//tables interlinked 

//helmet,cors
