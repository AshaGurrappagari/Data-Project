
const express = require('express');
const router = express.Router();
const villageController = require('../controllers/villageController');

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

router.get('/village',(req,res)=>{
    res.send(`<h1>Welcome to ward page</h1>
        <form action='/village/1/1/1' method='post' >
        <label for='region'>region:</label>
        <input type='text' id = 'region' name='region'/></br>
        <label for='district'>district:</label>
        <input type='text' id = 'district' name='district'/></br>
        <label for='ward'>ward:</label>
        <input type='text' id = 'ward' name='ward'/></br>
        <label for='village'>village:</label>
        <input type='text' id = 'village' name='village'/></br>
        <label for='minCurrent'>Min(Current):</label>
        <input type='text' id = 'minCurrent' name='minCurrent'/></br>
        <label for='maxCurrent'>Max(Current):</label>
        <input type='text' id = 'maxCurrent' name='maxCurrent'/></br>
        <label for='minLast'>Min(Last):</label>
        <input type='text' id = 'minLast' name='minLast'/></br>
        <label for='maxLast'>Max(Last):</label>
        <input type='text' id = 'maxLast' name='maxLast'/></br>
        <label for='crop'>Crop:</label>
        <input type='text' id = 'crop' name='crop'/></br>
        <label for='variety'>variety:</label>
        <input type='text' id = 'variety' name='variety'/></br>
        <input type='submit' value='submit'/>
        </form>
        `);
});

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

router.post('/village/:id/:districtId/:wardId', villageController.villagenew);

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

router.get('/village/getdata', villageController.villageData);

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

router.get('/village/query',villageController.villageFilteredData);

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
 *               district:
 *                 type: string
 *                 description: The name of the district.
 *                 example: AP
 *               ward:
 *                 type: string
 *                 description: The name of the ward.
 *                 example: TPT
 *               village:
 *                 type: string
 *                 description: The name of the village.
 *                 example: SN
 *               minCurrent:
 *                 type: integer
 *                 description: Minimum current value.
 *                 example: 42000
 *               maxCurrent:
 *                 type: integer
 *                 description: Maximum current value.
 *                 example: 42000
 *               minLast:
 *                 type: integer
 *                 description: Minimum last value.
 *                 example: 42000
 *               maxLast:
 *                 type: integer
 *                 description: Maximum last value.
 *                 example: 42000
 *               crop:
 *                 type: string
 *                 description: Crop name.
 *                 example: new crop
 *               variety:
 *                 type: string
 *                 description: Variety name.
 *                 example: new variety
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

router.put('/village/:id',villageController.updatedvillagedata);

module.exports = router;