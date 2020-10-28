const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const CommentsController = require('../controllers/comment.js');


/**
 * @swagger
 * /comment:
 *   get:
 *     summary: returns all comments
 *     tags:
 *       - Comments
 *     description: Returns all comments
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of comments
 *       500:
 *         description: SERVER ERROR
 */
router.get("/", CommentsController.getComments);

/**
 * @swagger
 *
 * /comment:
 *    post:
 *      summary: add a comment
 *      tags: [Comments]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/comment'
 *      responses:
 *        "201":
 *          description: A comment schema
 *
 * components:
 *    schemas:
 *      comment:
 *        type: object
 *        required:
 *          - article_id
 *          - names
 *          - email
 *          - comment
 *        properties:
 *          article_id:
 *            type: string
 *          names:
 *            type: string
 *          email:
 *              type: string
 *          comment:
 *              type: string
 *       
 */
router.post("/", checkAuth, CommentsController.postComment);

/**
 * @swagger
 * /comment/{_id}:
 *   get:
 *     summary: Returns a single comment based on ID
 *     tags:
 *       - Comments
 *     description: Returns a single comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: Particular comment Object's ID (Automatically assigned by MongoDB)
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single comment
 *       500:
 *         description: Server Error
 */
router.get("/:id", checkAuth, CommentsController.getComment);

/**
 * @swagger
 *
 * /comment/{id}:
 *    put:
 *      summary: Comment update based on ID
 *      tags: [Comments]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Comment ID
 *          required: true
 *      requestBody:
 *        required: false
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/comment'
 *      responses:
 *        "201":
 *          description: A comment schema
 *
 * components:
 *    schemas:
 *      comment:
 *        type: object
 *        required:
 *          - article_id
 *          - names
 *          - email
 *          - comment
 *        properties:
 *          article_id:
 *            type: string
 *          names:
 *            type: string
 *          email:
 *              type: string
 *          comment:
 *              type: string
 *       
 */
router.put("/:id", checkAuth, CommentsController.updateComment);

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Deletes a comment based on ID
 *     tags:
 *       - Comments
 *     description: Deletes a single comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Comment's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete("/:id", checkAuth, CommentsController.deleteComment);


module.exports = router;
 