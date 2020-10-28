const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ArticlesController = require('../controllers/article.js');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

/**
 * @swagger
 * /article:
 *   get:
 *     summary: returns all articles
 *     tags:
 *       - Articles
 *     description: Returns all articles
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of articles
 *       500:
 *         description: SERVER ERROR
 */
router.get("/", ArticlesController.getArticles);


/**
 * @swagger
 *
 * /article:
 *    post:
 *      summary: add an article
 *      tags: [Articles]
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/article'
 *      responses:
 *        "201":
 *          description: An article schema
 *
 * components:
 *    schemas:
 *      article:
 *        type: object
 *        required:
 *          - title
 *          - content
 *          - articleImage
 *        properties:
 *          title:
 *            type: string
 *          content:
 *            type: string
 *          articleImage:
 *              type: string
 *              format: binary
 *       
 * 
 * 
 */
router.post("/", checkAuth, upload.single('articleImage'), ArticlesController.postArticle);

/**
 * @swagger
 * /article/{_id}:
 *   get:
 *     summary: Returns a single article based on ID
 *     tags:
 *       - Articles
 *     description: Returns a single article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: Particular Article Object's ID (Automatically assigned by MongoDB)
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single article
 *       500:
 *         description: Server Error
 */

router.get("/:id", checkAuth, ArticlesController.getArticle);

/**
 * @swagger
 *
 * /article/{id}:
 *    put:
 *      summary: Article update based on ID
 *      tags: [Articles]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Article ID
 *          required: true
 *      requestBody:
 *        required: false
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/article'
 *      responses:
 *        "201":
 *          description: An article schema
 *
 * components:
 *    schemas:
 *      article:
 *        type: object
 *        required: 
 *          - title
 *          - content
 *          - articleImage
 *        properties:
 *          title:
 *            type: string
 *          content:
 *            type: string
 *          articleImage:
 *            type: string
 *            format: binary
 *
 */
router.put("/:id", checkAuth, ArticlesController.updateArticle);


/**
 * @swagger
 * /article/{id}:
 *   delete:
 *     summary: Deletes an article based on ID
 *     tags:
 *       - Articles
 *     description: Deletes a single article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Article's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete("/:id", checkAuth, ArticlesController.deleteArticle);


module.exports = router;
 