const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const SkillsController = require('../controllers/skill.js');

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
 * /skill:
 *   get:
 *     summary: returns all skills
 *     tags:
 *       - Skills
 *     description: Returns all skills
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of skills
 *       500:
 *         description: SERVER ERROR
 */
router.get("/", SkillsController.getSkills);

/**
 * @swagger
 *
 * /skill:
 *    post:
 *      summary: add a skill
 *      tags: [Skills]
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/skill'
 *      responses:
 *        "201":
 *          description: A skill schema
 *
 * components:
 *    schemas:
 *      skill:
 *        type: object
 *        required:
 *          - title
 *          - content
 *          - skillImage
 *        properties:
 *          title:
 *            type: string
 *          content:
 *            type: string
 *          skillImage:
 *              type: string
 *              format: binary
 *        
 */
router.post("/", checkAuth, upload.single('skillImage'), SkillsController.postSkill);

/**
 * @swagger
 * /skill/{_id}:
 *   get:
 *     summary: Returns a single skill based on ID
 *     tags:
 *       - Skills
 *     description: Returns a single skill
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: Particular Skill Object's ID (Automatically assigned by MongoDB)
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single skill
 *       500:
 *         description: Server Error
 */
router.get("/:id", checkAuth, SkillsController.getSkill);

/**
 * @swagger
 *
 * /skill/{id}:
 *    put:
 *      summary: Skill update based on ID
 *      tags: [Skills]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Skill ID
 *          required: true
 *      requestBody:
 *        required: false
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/skill'
 *      responses:
 *        "201":
 *          description: A skill schema
 *
 * components:
 *    schemas:
 *      service:
 *        type: object
 *        required: 
 *          - title
 *          - content
 *          - skillImage
 *        properties:
 *          title:
 *            type: string
 *          content:
 *            type: string
 *          skillImage:
 *            type: string
 *            format: binary
 *
 */
router.put("/:id", checkAuth, SkillsController.updateSkill);

/**
 * @swagger
 * /skill/{id}:
 *   delete:
 *     summary: Deletes a skill based on ID
 *     tags:
 *       - Skills
 *     description: Deletes a single skill
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Skills id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete("/:id", checkAuth, SkillsController.deleteSkill);


module.exports = router;
 