
const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

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

router.get('/region', (req, res) => {
    res.send(`
        <h1>Welcome to the Region page</h1>
        <form action='/region' method='post'>
            <label for='region'>Region:</label>
            <input type='text' id='region' name='region'/><br/>
            <input type='submit' value='Submit'/>
        </form>
    `);
});

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

router.post('/region', regionController.regionnew);

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

router.get('/regiondata', regionController.regionnewdata);

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

router.get('/region/:id', regionController.regiondatabyId);

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


router.get('/regionbyPk/:id', regionController.regionDataByPk);

module.exports = router;
