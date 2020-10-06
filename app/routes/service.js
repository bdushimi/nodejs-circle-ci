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

router.get("/", ServicesController.getServices);

router.post("/", checkAuth, upload.single('serviceImage'), ServicesController.postService);

router.get("/:id", checkAuth, ServicesController.getService);

router.put("/:id", checkAuth, ServicesController.updateService);

router.delete("/:id", checkAuth, ServicesController.deleteService);


module.exports = router;
 