
const express = require('express');
const router = express.Router();
const wardController = require('../controllers/wardController');

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

router.get('/ward',(req,res)=>{
    res.send(`<h1>Welcome to ward page</h1>
        <form action='/ward/1' method='post' >
        <label for='ward'>ward:</label>
        <input type='text' id = 'ward' name='ward'/></br>
        <input type='submit' value='submit'/>
        </form>
        `);
});

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

router.post('/ward/:id', wardController.wardnew);

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

router.get('/wardbyId/:id', wardController.wardDataById);

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

router.get('/wardbyPk/:id', wardController.wardDataByPk);

module.exports = router;