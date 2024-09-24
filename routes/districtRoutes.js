const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtController');

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

router.get('/district', (req, res) => {
    res.send(`
        <h1>Welcome to the District page</h1>
        <form action='/district/1' method='post'>
            <label for='district'>District:</label>
            <input type='text' id='district' name='district'/><br/>
            <input type='submit' value='Submit'/>
        </form>
    `);
});

/**
 * @swagger
 * /district/{id}:
 *   post:
 *     summary: Insert District Data
 *     description: Insert district data into the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the region to which this district belongs
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: Data inserted successfully
 */

router.post('/district/:id', districtController.districtnew);

/**
 * @swagger
 * /districtByPK/{id}:
 *   get:
 *     summary: Get district data with primary key
 *     description: Retrieve district data with primary key.
 *     parameters:
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
 */

router.get('/districtByPK/:id', districtController.districtDataByPk);

/**
 * @swagger
 * /districtById/{id}:
 *   get:
 *     summary: Get district data with district ID
 *     description: Retrieve district data using district ID.
 *     parameters:
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
 */

router.get('/districtById/:id', districtController.districtDataById);

module.exports = router;
