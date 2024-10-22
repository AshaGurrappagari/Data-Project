const customException = require('../errorHandler/customException');
const { BAD_REQUEST, SUCCESS_CODE, SERVER_ERROR, NOT_FOUND } = require('../utils/statusCode');
const response = require('../errorHandler/response');
const sequelize = require('../config/database');
const userService = require('../services/user.service');

module.exports = {
 /**
 * @swagger
 *  components:
 *      schemas:
 *          user:
 *              type: object
 *              properties:
 *                  user_id:
 *                      type: integer
 *                      description: This is the user ID
 *                      example: 1
 *                  first_name:
 *                      type: string
 *                      description: firstName of user
 *                      example: Asha
 *                  last_name:
 *                      type: string
 *                      description: lastName of user
 *                      example: G
 *                  email:
 *                      type: string
 *                      description: The email of user
 *                      example: asha@yopmail.com
 *                  password:
 *                      type: string
 *                      description: The password of user
 *                      example: encyrpted password
 *                  token:
 *                      type: string
 *                      description: Token for user
 *                      example: decoded token 
 */

 /**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - "User Role"
 *     summary: Insert user Data
 *     description: Insert user data into the database
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: firstName of user
 *                 example: Asha
 *               last_name:
 *                 type: string
 *                 description: lastName of user
 *                 example: G
 *               email:
 *                 type: string
 *                 description: email of user
 *                 example: asha@gmail.com
 *               password:
 *                 type: string
 *                 description: password of user
 *                 example: Asha@1000
 *     responses:
 *       200:
 *         description: Data inserted successfully
 *       400:
 *         description: Bad request, invalid input.
 *       500:
 *         description: Internal server error.
 */

    createUser: async function (req, res) {
        const transaction = await sequelize.transaction();
        try {
            const result = await userService.newUser(req, transaction);
            if (result?.err) {
                await transaction.rollback();
                return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST, result.err.message, result.err.displayMessage));
            }
            await transaction.commit();
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, { Users: result.data }, result.message, result.displayMessage));
        } catch (err) {
            await transaction.rollback();
            console.error('Error in creating User:', err);
            return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while creating Users'));
        }
    },

/**
 * @swagger
 * /userRole:
 *   post:
 *     tags:
 *       - "User Role"
 *     summary: Create a new user role
 *     description: Save user role data into the database.
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
 *       - in: body
 *         name: userRole
 *         description: User role data to be saved.
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - targetUserId
 *             - permission
 *           properties:
 *             targetUserId:
 *               type: integer
 *             permission:
 *               type: string
 *     responses:
 *       200:
 *         description: Data inserted successfully.
 *       400:
 *         description: Bad request, invalid input.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal server error.
 */

createRole: async function (req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { targetUserId, permission } = req.body;            
            const userId = req.user.userId; 
            console.log('Target User ID:', targetUserId); 
            console.log('Current User ID:', userId);
            const result = await userService.userRole(permission, targetUserId, userId, transaction);
    
            if (result?.err) {
                await transaction.rollback();
                return res.status(BAD_REQUEST).json(customException.error(BAD_REQUEST, result.err.message, result.err.displayMessage));
            }
            await transaction.commit();
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE, { user: result.data }, result.message, result.displayMessage));
        } 
        catch (err) {
            await transaction.rollback();
            console.error('Error in creating role:', err);
            return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR, err.message, 'An error occurred while creating role'));
        }
    },

 /**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - "User Role"
 *     summary: fetch user Data
 *     description: fetch user data into the database
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: email of user
 *                 example: asha@gmail.com
 *               password:
 *                 type: string
 *                 description: password of user
 *                 example: Asha@1000
 *     responses:
 *       200:
 *         description: Data inserted successfully
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal server error
 */
    
    userLogin: async function(req,res){
        try{
            const result = await userService.login(req.body);
            if(result?.err) return res.status(NOT_FOUND).json(customException.error(NOT_FOUND,result.err.message,result.err.displayMessage));
            return res.status(SUCCESS_CODE).json(response.successWith(SUCCESS_CODE,{userLogin:result.data},'Success','user fetched successfully'));
        }
        catch(err){
            console.log('error in fetching user',err);
            return res.status(SERVER_ERROR).json(response.errorWith(SERVER_ERROR,err.message,'An error occurred while fetching user'));    
        }
    }
};
