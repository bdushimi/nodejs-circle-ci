const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ServicesController = require('../controllers/service.js');

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
 * /service:
 *   get:
 *     summary: returns all services
 *     tags:
 *       - Services
 *     description: Returns all services
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of services
 *       500:
 *         description: SERVER ERROR
 */
router.get("/", ServicesController.getServices);

/**
 * @swagger
 *
 * /service:
 *    post:
 *      summary: add a service
 *      tags: [Services]
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/services'
 *      responses:
 *        "201":
 *          description: A service schema
 *
 * components:
 *    schemas:
 *      services:
 *        type: object
 *        required:
 *          - title
 *          - content
 *          - serviceImage
 *        properties:
 *          title:
 *            type: string
 *          content:
 *            type: string
 *          serviceImage:
 *              type: string
 *              format: binary
 *        
 */
router.post("/", checkAuth, upload.single('serviceImage'), ServicesController.postService);

/**
 * @swagger
 * /service/{_id}:
 *   get:
 *     summary: Returns a single service based on ID
 *     tags:
 *       - Services
 *     description: Returns a single service
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: Particular Service Object's ID (Automatically assigned by MongoDB)
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single article
 *       500:
 *         description: Server Error
 */

router.get("/:id", checkAuth, ServicesController.getService);

/**
 * @swagger
 *
 * /service/{id}:
 *    put:
 *      summary: Service update based on ID
 *      tags: [Services]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Service ID
 *          required: true
 *      requestBody:
 *        required: false
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/services'
 *      responses:
 *        "201":
 *          description: A service schema
 *
 * components:
 *    schemas:
 *      services:
 *        type: object
 *        required: 
 *          - title
 *          - content
 *          - serviceImage
 *        properties:
 *          title:
 *            type: string
 *          content:
 *            type: string
 *          serviceImage:
 *            type: string
 *            format: binary
 *
 */
router.put("/:id", checkAuth, ServicesController.updateService);

/**
 * @swagger
 * /service/{id}:
 *   delete:
 *     summary: Deletes a service based on ID
 *     tags:
 *       - Services
 *     description: Deletes a single service
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Service's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete("/:id", checkAuth, ServicesController.deleteService);


module.exports = router;
 