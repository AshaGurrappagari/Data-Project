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
 * /village/{id}:
 *   get:
 *     summary: get village data with primary key
 *     description: Retrieve village data with primary key.
 *     parameters:
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
 */

const villageByPK = async (req,res)=>{
    try{
        const result = await villageService.villageByPk(req,res);
        if(result.err){
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
        }
        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{activeVillage:result.data.activeVillage},'Success','villages fetched successfully'));
    }
    catch(err){
        console.log('error in fetching village',err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'));
    }
};

// const villageFilteredData = async (req,res)=>{
//     try{
//         const result = await villageService.villageDatafiltered(req,res);
//         if(result.err){
//             return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
//         }
//         return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{villageD:result.data},'Success','villages fetched successfully'));
//     }
//     catch(err){
//         console.log('error in fetching village',err);
//         return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching villages'));
//     }
// };

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
 * /paginatedData:
 *   get:
 *     summary: Get village data with pagination
 *     description: Retrieve paginated village data with sorting options.
 *     parameters:
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
 *           description: The column to order by (e.g., 'village_id').
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

const allvillageData = async (req, res) => {
    try {
        const result = await villageService.allvillages(req);

        if (result.err) {
            return res.status(NOT_FOUND).json(customException.error(NOT_FOUND, result.err.message, 'Failed to fetch villages'));
        }

        return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, {
            villages: result.data.villages, 
            totalItems: result.data.totalItems,
            totalPages: result.data.totalPages,
            currentPage: result.data.currentPage
        }, 'Success', 'Villages fetched successfully'));

    } catch (err) {
        console.log('Error in fetching villages', err);
        return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while fetching villages'));
    }
};



module.exports = {villagenew,villageByPK,updatedvillagedata,deletedvillagedata,allvillageData};

