const customException = require('../errorHandler/customException');
const districtService = require('../services/district.service');
const response = require('../errorHandler/response');
const sequelize = require('../config/database');
const {SUCCESS_CODE,SERVER_ERROR,BAD_REQUEST, NOT_FOUND} = require('../utils/statusCode');

module.exports = {
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
 * /district:
 *   post:
 *     tags:
 *       - "District Service"
 *     summary: Insert District Data
 *     description: Insert district data into the database
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
 *               district:
 *                 type: string
 *                 description: Name of the district
 *                 example: Andhra Pradesh
 *               region:
 *                 type: string
 *                 description: Name of the district
 *                 example: India

 *     responses:
 *       200:
 *         description: Data inserted successfully
 */

districtnew : async function (req,res){
    try{
        const transaction = await sequelize.transaction();
        const result = await districtService.districtData(req,transaction);
        if(result?.err){
            await transaction.rollback();
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        else{
            await transaction.commit();
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, { regionD: result.data }, result.message, result.displayMessage));
        }
    }
    catch(err){
        console.log('error in giving district',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while creating districts'));

    }
},

/**
 * @swagger
 * /districtByPK/{id}:
 *   get:
 *     tags:
 *       - "District Service"
 *     summary: Get district data with primary key
 *     description: Retrieve district data with primary key.
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
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */


districtDataByPk : async function(req,res) {
    try{
        const result = await districtService.districtByPk(req.params.id);
        if(result?.err){
            return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{districtD:result.data},'Success','districts fetched successfully'));
    }
    catch(err){
        console.log('error in fetching district',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching districts'));
    }
},

/**
 * @swagger
 * /district/{id}:
 *   put:
 *     tags:
 *       - "District Service"
 *     summary: update district data with districtId
 *     description: Soft update district data with districtId
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
 *               district:
 *                 type: string
 *                 description: The name of the district.
 *                 example: AP

 *     responses:
 *       200:
 *         description: district data updated successfully.
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */


    updatedDistrictData: async function (req, res) {
    try{
        const transaction = await sequelize.transaction();
        const result = await districtService.updateDistricts(req.params.id,req.body.district,transaction);
        if(result?.err){
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
},

/**
 * @swagger
 * /district/{id}:
 *   delete:
 *     tags:
 *       - "District Service"
 *     summary: Delete district data with districtId
 *     description: Soft Delete district data with districtId
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
 *         description: district data deleted successfully.
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */


deletedDistrictsData : async function(req,res) {
    try{
        const transaction = await sequelize.transaction();
        const result = await districtService.deleteDistrict(req.params.id,transaction);
        if(result?.err){
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
},

/**
 * @swagger
 * /districtData:
 *   get:
 *     tags:
 *       - "District Service"
 *     summary: Get district data with pagination
 *     description: Retrieve paginated district data with sorting options.
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           description: Token to be passed as a header.
 *           required: true
 *           schema:
 *              type: string
 *         - in: query
 *           name: search
 *           description: search with district name.
 *           schema: 
 *              type: string
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

alldistrictsData : async function(req,res)  {
    try {
        const result = await districtService.alldistricts(req);
        if (result?.err) return res.status(NOT_FOUND).json(customException.error(NOT_FOUND, result.err.message, 'Failed to fetch districts'));
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, {districts: result.data}, 'Success', 'districts fetched successfully'));
    } catch (err) {
        console.log('Error in fetching districts', err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while fetching districts'));
    }
}
};

