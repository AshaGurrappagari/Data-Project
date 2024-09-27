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

// /**
//  * @swagger
//  * /regiondata:
//  *   get:
//  *     summary: Get all regions
//  *     description: Retrieve a list of all regions.
//  *     responses:
//  *       200:
//  *         description: A JSON array of region objects
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                  $ref : '#components/schemas/Region'
//  */

// const regionnewdata = async (req,res) =>{
//     try{
//         const result = await regionService.allregion(req);
//         if(result.err){
//             return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
//         }
//         return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{regionD:result.data},'Success','Regions fetched successfully'));
//     }
//     catch(err){
//         console.log('error in fetching region',err);
//         return res.status(SERVER_ERROR).json(response.errorWith(err.message,'An error occurred while fetching regions'));
//     }
// };

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

/**
 * @swagger
 * /region/{id}:
 *   put:
 *     summary: update region data with regionId
 *     description: Soft update region data with regionId
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
 *               region:
 *                 type: string
 *                 description: The name of the region.
 *                 example: TPT

 *     responses:
 *       200:
 *         description: region data updated successfully.
 */

const updatedRegiondata = async (req,res)=> {
    try{
        const transaction = await sequelize.transaction();
        const result = await regionService.updateRegion(req,transaction);
        if(result.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        await transaction.commit();
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{updatedRegions:result.data.updatedRegions},'Success','Region updated Successfully'));
    }
    catch(err){
        console.log('Error in updating region data');
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while updating regions'));
    }
};

/**
 * @swagger
 * /region/{id}:
 *   delete:
 *     summary: Delete region data with regionId
 *     description: Soft Delete region data with regionId
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: numeric Id required
 *           schema: 
 *              type: integer
 *     responses:
 *       200:
 *         description: region data deleted successfully.
 */

const deletedRegiondata = async (req,res) => {
    try{
        const transaction = await sequelize.transaction();
        const result = await regionService.deleteRegion(req,transaction);
        if(result.err){
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
};

/**
 * @swagger
 * /regionData:
 *   get:
 *     summary: Get region data with pagination
 *     description: Retrieve paginated region data with sorting options.
 *     parameters:
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

const allregionData = async (req, res) => {
    try {
        const result = await regionService.allregion(req);

        if (result.err) {
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND, result.err.message, 'Failed to fetch regions'));
        }

        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, {
            regions: result.data.regions, 
            totalItems: result.data.totalItems,
            totalPages: result.data.totalPages,
            currentPage: result.data.currentPage
        }, 'Success', 'regions fetched successfully'));

    } catch (err) {
        console.log('Error in fetching regions', err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while fetching regions'));
    }
};

module.exports = {regionnew,allregionData,regionDataByPk,updatedRegiondata,deletedRegiondata};


//create 1 branch from main
//insert,update,delete,fetch-2 in same api
//deletedAt in all tables
//pagination pagenum, pagesize, orderby, sortby
//tables interlinked 

//helmet,cors
