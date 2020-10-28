const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProfessionsController = require('../controllers/profession.js');

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
 * /profession:
 *   get:
 *     summary: display a profession
 *     tags:
 *       - Profession
 *     description: Returns the profession
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: SERVER ERROR
 */
router.get("/", ProfessionsController.getProfessions);

/**
 * @swagger
 *
 * /profession:
 *    post:
 *      summary: add a profession
 *      tags: [Profession]
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/profession'
 *      responses:
 *        "201":
 *          description: A profession schema
 *
 * components:
 *    schemas:
 *      profession:
 *        type: object
 *        required:
 *          - welcomeMessage
 *          - professionTitle
 *          - professionImage
 *        properties:
 *          welcomeMessage:
 *            type: string
 *          professionTitle:
 *            type: string
 *          professionImage:
 *              type: string
 *              format: binary
 *       
 */
router.post("/", checkAuth, upload.single('professionImage'), ProfessionsController.postProfession);

/**
 * @swagger
 * /profession/{_id}:
 *   get:
 *     summary: Returns a profession based on ID
 *     tags:
 *       - Profession
 *     description: Returns a single profession
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: Particular Profession Object's ID (Automatically assigned by MongoDB)
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A profession article
 *       500:
 *         description: Server Error
 */
router.get("/:id", checkAuth, ProfessionsController.getProfession);

 /**
 * @swagger
 *
 * /profession/{id}:
 *    put:
 *      summary: Profession update based on ID
 *      tags: [Profession]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Profession ID
 *          required: true
 *      requestBody:
 *        required: false
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/profession'
 *      responses:
 *        "201":
 *          description: A profession schema
 *
 * components:
 *    schemas:
 *      profession:
 *        type: object
 *        required: 
 *          - welcomeMessage
 *          - professionTitle
 *          - professionImage
 *        properties:
 *          welcomeMessage:
 *            type: string
 *          professionTitle:
 *            type: string
 *          professionImage:
 *            type: string
 *            format: binary
 *
 */
router.put("/:id", checkAuth, ProfessionsController.updateProfession);

/**
 * @swagger
 * /profession/{id}:
 *   delete:
 *     summary: Deletes a profession based on ID
 *     tags:
 *       - Profession
 *     description: Deletes a single profession
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Profession's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete("/:id", checkAuth, ProfessionsController.deleteProfession);


module.exports = router;
 