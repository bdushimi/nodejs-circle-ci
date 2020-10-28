const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const QueriesController = require('../controllers/querie.js');



/**
 * @swagger
 * /querie:
 *   get:
 *     summary: returns all queries
 *     tags:
 *       - Queries
 *     description: Returns all queries
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of queries
 *       500:
 *         description: SERVER ERROR
 */
router.get("/", QueriesController.getQueries);

/**
 * @swagger
 *
 * /querie:
 *    post:
 *      summary: add a querie
 *      tags: [Queries]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/querie'
 *      responses:
 *        "201":
 *          description: A querie schema
 *
 * components:
 *    schemas:
 *      querie:
 *        type: object
 *        required:
 *          - names
 *          - email
 *          - subject
 *          - message
 *        properties:
 *          names:
 *            type: string
 *          email:
 *            type: string
 *          subject:
 *              type: string
 *          message:
 *              type: string
 *       
 */
router.post("/", checkAuth, QueriesController.postQuerie);

/**
 * @swagger
 * /querie/{_id}:
 *   get:
 *     summary: Returns a single querie based on ID
 *     tags:
 *       - Queries
 *     description: Returns a single querie
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: Particular querie Object's ID (Automatically assigned by MongoDB)
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single querie
 *       500:
 *         description: Server Error
 */
router.get("/:id", checkAuth, QueriesController.getQuerie);

/**
 * @swagger
 *
 * /querie/{id}:
 *    put:
 *      summary: Querie update based on ID
 *      tags: [Queries]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Querie ID
 *          required: true
 *      requestBody:
 *        required: false
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/querie'
 *      responses:
 *        "201":
 *          description: A querie schema
 *
 * components:
 *    schemas:
 *      querie:
 *        type: object
 *        required:
 *          - names
 *          - email
 *          - subject
 *          - message
 *        properties:
 *          names:
 *            type: string
 *          email:
 *            type: string
 *          subject:
 *              type: string
 *          message:
 *              type: string
 *       
 */
router.put("/:id", checkAuth, QueriesController.updateQuerie);

/**
 * @swagger
 * /querie/{id}:
 *   delete:
 *     summary: Deletes a querie based on ID
 *     tags:
 *       - Queries
 *     description: Deletes a single querie
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Querie's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete("/:id", checkAuth, QueriesController.deleteQuerie);


module.exports = router;
 